import { afterEach, expect, test } from "bun:test"
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { buildFromRaw, isBangumiCover, SOURCE_FILENAME } from "./build-from-raw.mjs"

const directories: string[] = []
async function fixture(files: Record<string, unknown>) {
  const root = await mkdtemp(path.join(tmpdir(), "anime-raw-test-"))
  directories.push(root)
  await mkdir(path.join(root, "data/raw"), { recursive: true })
  for (const [name, value] of Object.entries(files)) {
    await writeFile(path.join(root, "data/raw", name), typeof value === "string" ? value : JSON.stringify(value))
  }
  return root
}
afterEach(async () => {
  for (const root of directories.splice(0)) {
    // mkdtemp returns the exact test directory, never a user-supplied or computed parent.
    if (path.dirname(root) !== path.resolve(tmpdir()) || !path.basename(root).startsWith("anime-raw-test-")) throw new Error("Unsafe test cleanup path")
    await rm(root, { recursive: true, force: true })
  }
})

const item = (id: number | string, name = `Title ${id}`) => ({ id, name, cover: "https://lain.bgm.tv/pic/test.jpg" })

test("prefers exact Subject ID jpg files and preserves remote fallback, order and metadata", async () => {
  const root = await fixture({
    [SOURCE_FILENAME]: { years: { "2025": { items: [
      { ...item(99, "same name"), ratingCount: 300 },
      { ...item(12, "same name"), ratingCount: 200 },
      item(30), item(40),
    ] } } },
  })
  const covers = path.join(root, "public/covers")
  await mkdir(covers, { recursive: true })
  await writeFile(path.join(covers, "99.jpg"), "local fixture")
  await writeFile(path.join(covers, "12.png"), "wrong extension")
  await mkdir(path.join(covers, "30.jpg"))
  await writeFile(path.join(covers, "999.jpg"), "extra cover")
  const { data } = await buildFromRaw({ projectRoot: root })
  expect(data["2025"]!.map(entry => entry.id)).toEqual([99, 12, 30, 40])
  expect(data["2025"]![0]).toMatchObject({
    bangumiId: 99, year: 2025, title: "same name", name: "same name", ratingCount: 300,
    coverUrl: "covers/99.jpg", cover: "covers/99.jpg",
  })
  for (const entry of data["2025"]!.slice(1)) expect(entry.coverUrl).toBe("https://lain.bgm.tv/pic/test.jpg")
  expect(data["2025"]![1]!.ratingCount).toBe(200)
  const generated = await import(`${path.join(root, "anime-data.js")}?local-covers`)
  expect(generated.default).toEqual(data)
})

test("reads only the selected dataset, preserving raw order and deduplicating within each year", async () => {
  const root = await fixture({
    [SOURCE_FILENAME]: { meta: {}, years: {
      "2024": { items: [item(99)] },
      "2025": { items: [item(99, "Z first"), item(12, "A second"), item(99, "duplicate"), item(30, "same name"), item("bgm-12"), item(4, "same name")] },
    } },
    "bgm_2025_japan_tv.json": [item(999, "Must not be imported")],
    "bgm_japan_tv_2006_2010.json": "broken JSON that must never be read",
  })
  const { data, report } = await buildFromRaw({ projectRoot: root })
  expect(data["2025"]!.map((x: { id: number }) => x.id)).toEqual([99, 12, 30, 4])
  expect(data["2025"]![0]!.name).toBe("Z first")
  expect(data["2024"]!.map((x: { id: number }) => x.id)).toEqual([99])
  expect(report.years["2025"]).toMatchObject({ rawItems: 6, finalItems: 4, duplicateIds: 2 })
  expect(report.totals).toMatchObject({ finalAnime: 5, uniqueSubjectIds: 4, duplicateIds: 2 })
  const generated = await import(`${path.join(root, "anime-data.js")}?test`)
  expect(generated.default).toEqual(data)
  expect(data["2025"]![0]!).toMatchObject({ id: 99, bangumiId: 99, year: 2025, title: "Z first", name: "Z first", coverUrl: "https://lain.bgm.tv/pic/test.jpg" })
  expect(report.files.map(file => file.file)).toEqual([`data/raw/${SOURCE_FILENAME}`])
  expect(report.unreadableFiles).toEqual([])
})

test("explicit JSON years are used; missing or conflicting years are reported", async () => {
  const root = await fixture({
    [SOURCE_FILENAME]: { years: {
      "2024": { items: [{ ...item(1), year: 2024 }] },
      "2023": { items: [item(3)] },
      "2022": { items: [item(4)] },
      "unknown": { items: [item(5)] },
      "2020": { items: [{ ...item(6), year: 2021 }] },
    } },
  })
  const { data, report } = await buildFromRaw({ projectRoot: root })
  expect(data["2024"]![0]!.id).toBe(1)
  expect(data["2023"]![0]!.id).toBe(3)
  expect(data["2022"]![0]!.id).toBe(4)
  expect(data["2025"]).toBeUndefined()
  expect(report.unknownYears).toHaveLength(2)
})

test("bad records do not discard valid data; incomplete fields stay reportable", async () => {
  const root = await fixture({
    [SOURCE_FILENAME]: { years: { "2024": { items: null }, "2025": { items: [
      item(7), { name: "no ID" }, { ...item(-1) }, { id: 8 },
      { ...item(9), cover: "https://bgm.tv.evil.test/a" },
      { ...item(10), cover: "//lain.bgm.tv/pic/cover.jpg" },
      { id: "bgm-11", title: "Older raw schema", coverUrl: null },
    ] } } },
  })
  const { data, report } = await buildFromRaw({ projectRoot: root })
  expect(data["2025"]!.map((x: { id: number }) => x.id)).toEqual([7, 8, 9, 10, 11])
  expect(data["2025"]![1]).toMatchObject({ id: 8, bangumiId: 8, year: 2025, title: "", coverUrl: null, name: "", cover: null })
  expect(data["2025"]![2]!.cover).toBeNull()
  expect(data["2025"]![3]!.cover).toBe("https://lain.bgm.tv/pic/cover.jpg")
  expect(report.unreadableFiles).toHaveLength(0)
  expect(report.structuralErrors).toHaveLength(1)
  expect(report.totals).toMatchObject({ missingIds: 1, invalidIds: 1, missingNames: 1, missingCovers: 3, invalidCovers: 1 })
  expect(JSON.parse(await readFile(path.join(root, "data/build-report.json"), "utf8"))).toEqual(report)
})

test("a build without usable data writes an error report and preserves the previous catalog", async () => {
  const root = await fixture({ [SOURCE_FILENAME]: "[", "bgm_2025_japan_tv.json": [item(999)] })
  await writeFile(path.join(root, "anime-data.js"), "existing catalog")
  await expect(buildFromRaw({ projectRoot: root })).rejects.toThrow("existing anime-data.js preserved")
  expect(await readFile(path.join(root, "anime-data.js"), "utf8")).toBe("existing catalog")
})

test("BOM input is supported and repeated builds are deterministic", async () => {
  const root = await fixture({ [SOURCE_FILENAME]: "\uFEFF" + JSON.stringify({ meta: { year: 2025 }, items: [item(42, "  原始名称  ")] }) })
  await buildFromRaw({ projectRoot: root })
  const first = await readFile(path.join(root, "anime-data.js"), "utf8")
  await buildFromRaw({ projectRoot: root })
  expect(await readFile(path.join(root, "anime-data.js"), "utf8")).toBe(first)
  expect(first).toContain("  原始名称  ")
})

test("keeps ratingCount without reranking raw items and respects an explicit rank order", async () => {
  const root = await fixture({ [SOURCE_FILENAME]: { years: {
    "2024": { items: [{ ...item(8), ratingCount: 100 }, { ...item(3), ratingCount: 200 }] },
    "2025": { items: [{ ...item(2), rank: 2, ratingCount: 1000 }, { ...item(7), rank: 1, ratingCount: 50 }] },
  } } })
  const { data } = await buildFromRaw({ projectRoot: root })
  expect(data["2024"]!.map(item => item.id)).toEqual([8, 3])
  expect(data["2024"]!.map(item => item.ratingCount)).toEqual([100, 200])
  expect(data["2025"]!.map(item => item.id)).toEqual([7, 2])
})

test("a missing selected source does not fall back to old raw files", async () => {
  const root = await fixture({ "bgm_2025_japan_tv.json": [item(999)] })
  await writeFile(path.join(root, "anime-data.js"), "existing catalog")
  await expect(buildFromRaw({ projectRoot: root })).rejects.toThrow("existing anime-data.js preserved")
  expect(await readFile(path.join(root, "anime-data.js"), "utf8")).toBe("existing catalog")
})

test("cover validation accepts Bangumi domains and rejects unsafe or unrelated URLs", () => {
  expect(isBangumiCover("https://lain.bgm.tv/r/400/pic/a.jpg")).toBe(true)
  expect(isBangumiCover("https://bangumi.tv/a.jpg")).toBe(true)
  for (const value of ["javascript:alert(1)", "https://evilbgm.tv/a", "https://bgm.tv.evil.org/a", "https://secret@bgm.tv/a", ""]) {
    expect(isBangumiCover(value)).toBe(false)
  }
})
