import { afterEach, describe, expect, test } from "bun:test"
import { basename, dirname, join, resolve } from "node:path"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import {
  CheckpointStore, MAX_ATTEMPTS, ScrapeError, assertScope, crawlPages,
  filterLink, inspectGate, pageUrl, parsePage, withRetries, type Anime,
} from "./bgm-scraper"

// Synthetic fixtures model the observed Bangumi category-list markup, not live scrape results.
const source = "https://bgm.tv/anime/browser/%E6%97%A5%E6%9C%AC/tv/airtime/2025?sort=title"
const roots: string[] = []
const noDelay = async () => {}
const item = (id: number, title = `作品 ${id}`, cover: string | null = `//lain.bgm.tv/pic/cover/s/${id}.jpg`) =>
  `<li class="item" id="item_${id}"><a class="subjectCover" href="/subject/${id}">${cover === null ? "" : `<img src="${cover}">`}</a><div class="inner"><h3><a class="l" href="/subject/${id}">${title}</a><small>次要名称</small></h3></div></li>`
const html = (items = "") => `<!doctype html><html><head><title>2025 年日本 TV | Bangumi</title></head><body>
  <a href="/login">登录</a><h1>2025 年日本 TV</h1>
  <a href="${source}">TV</a><a href="${source}">日本</a><a href="${source}">2025年</a>
  <ul id="browserItemList">${items}</ul><div class="page_inner"><a href="${pageUrl(source, 40)}">40</a></div>
</body></html>`
const parsed = (page: number, items = "") => parsePage(html(items), pageUrl(source, page), 200, pageUrl(source, page))

function store(): CheckpointStore {
  const root = mkdtempSync(join(tmpdir(), "bgm-stage2-test-"))
  roots.push(root)
  const result = new CheckpointStore(root)
  result.setSource(source)
  return result
}

afterEach(() => {
  for (const root of roots.splice(0)) {
    const target = resolve(root)
    if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith("bgm-stage2-test-")) {
      throw new Error("Refusing to remove an unexpected test directory")
    }
    rmSync(target, { recursive: true, force: true })
  }
})

describe("category parsing", () => {
  test("keeps the displayed main name, extracts subject IDs, and keeps missing covers", () => {
    const result = parsed(1, item(12345, "页面名称 &amp; 原名") + item(23456, "同名作品", null))
    expect(result.items).toEqual([
      { id: "bgm-12345", bangumiId: 12345, year: 2025, title: "页面名称 & 原名", coverUrl: "https://lain.bgm.tv/pic/cover/s/12345.jpg" },
      { id: "bgm-23456", bangumiId: 23456, year: 2025, title: "同名作品", coverUrl: null },
    ])
    expect(inspectGate(html(), source)).toBeNull() // The normal navbar login link is harmless.
  })

  test("an empty list is valid only inside the intact successful category page", () => {
    expect(parsed(4).items).toEqual([])
    for (const status of [403, 429, 500, 502, 503]) {
      expect(() => parsePage(html(), pageUrl(source, 4), status, pageUrl(source, 4))).toThrow(`HTTP ${status}`)
    }
    for (const broken of ["", "<html><body>timeout</body></html>", html().replace('id="browserItemList"', 'id="changed"'),
      html("<li class='changed'>unparsed</li>"), html("<p>页面加载失败</p>"), html("数据加载中"),
      html("<li class='item'><h3>名称链接丢失</h3></li>"), html().replace(">日本<", ">unknown<")]) {
      expect(() => parsePage(broken, pageUrl(source, 4), 200, pageUrl(source, 4))).toThrow()
    }
  })

  test("login and security pages are not empty pages", () => {
    expect(() => parsePage("<title>Just a moment...</title>", source, 403, pageUrl(source, 1))).toThrow("安全验证")
    expect(inspectGate('<form><input type="password"></form>', "https://bgm.tv/login")).toBe("LOGIN_REQUIRED")
    expect(() => parsePage('<form><input type="password"></form>', "https://bgm.tv/login", 200, pageUrl(source, 1))).toThrow("人工登录")
  })

  test("rejects changed scope, redirects, bad IDs and third-party covers", () => {
    expect(() => assertScope(source.replace("2025", "2024"))).toThrow("2025")
    expect(() => assertScope(source.replace("%E6%97%A5%E6%9C%AC/", ""))).toThrow()
    expect(() => assertScope(source.replace("/tv/", "/ova/"))).toThrow()
    expect(() => parsePage(html(item(1)), pageUrl(source, 1), 200, pageUrl(source, 2))).toThrow("跳转")
    expect(() => parsed(1, item(1).replaceAll("/subject/1", "/subject/not-a-number"))).toThrow("ID")
    expect(() => parsed(1, item(1, "名字", "https://example.com/cover.jpg"))).toThrow("封面")
    expect(() => parsed(1, item(1, " "))).toThrow("名称")
  })

  test("follows actual filter links without constructing country parameters", () => {
    expect(filterLink(html(), "https://bgm.tv/anime/browser", "日本")).toBe(source)
    expect(() => filterLink(html(), source, "中国")).toThrow("唯一定位")
  })
})

describe("pagination, deduplication, and durable resume", () => {
  test("stops at first real empty page despite a fixed 40-page navigation", async () => {
    const checkpoint = store()
    const requested: number[] = []
    await crawlPages(checkpoint, async (url) => {
      const page = Number(new URL(url).searchParams.get("page"))
      requested.push(page)
      if (page > 4) throw new Error("Must not request a page after the first empty page")
      return parsed(page, page === 4 ? "" : item(page))
    }, noDelay)
    expect(requested).toEqual([1, 2, 3, 4])
    expect(checkpoint.progress.completed).toBe(true)
    expect(checkpoint.progress.firstEmptyPage).toBe(4)
    expect(checkpoint.progress.nextPage).toBe(5)
    expect(checkpoint.data).toHaveLength(3)
    await crawlPages(new CheckpointStore(roots[0]!), async () => { throw new Error("Completed run must not fetch") }, noDelay)
  })

  test("deduplicates within and across pages by subject ID, never by title", () => {
    const checkpoint = store()
    checkpoint.persistPage(parsed(1, item(1, "同名") + item(1, "同名") + item(2, "同名", null)))
    checkpoint.persistPage(parsed(2, item(1, "同名") + item(3, "另一部")))
    expect(checkpoint.data.map((entry) => entry.bangumiId)).toEqual([1, 2, 3])
    expect(checkpoint.data.filter((entry) => entry.title === "同名")).toHaveLength(2)
    expect(checkpoint.progress.pages.map((page) => [page.itemCount, page.addedCount])).toEqual([[3, 2], [2, 1]])
  })

  test("a page failure persists year/page/error and resumes without requesting saved pages", async () => {
    const checkpoint = store()
    let attempts = 0
    await expect(crawlPages(checkpoint, async (url) => {
      const page = Number(new URL(url).searchParams.get("page"))
      if (page === 1) return parsed(1, item(1))
      return withRetries(async () => { attempts++; throw new ScrapeError("HTTP", "HTTP 429", 429) }, noDelay)
    }, noDelay)).rejects.toThrow("429")
    expect(attempts).toBe(MAX_ATTEMPTS)
    expect(checkpoint.progress.completed).toBe(false)
    expect(checkpoint.progress.lastError).toMatchObject({ year: 2025, page: 2, code: "HTTP", status: 429, attempts: 3 })
    expect(JSON.parse(readFileSync(checkpoint.dataPath, "utf8"))).toHaveLength(1)
    const resumed = new CheckpointStore(roots[0]!)
    const requested: number[] = []
    await crawlPages(resumed, async (url) => {
      const page = Number(new URL(url).searchParams.get("page"))
      requested.push(page)
      return parsed(page)
    }, noDelay)
    expect(requested).toEqual([2])
    expect(resumed.progress.lastError).toBeNull()
    expect(resumed.progress.firstEmptyPage).toBe(2)
  })

  for (const dataAlreadyWritten of [false, true]) {
    test(`recovers interruption ${dataAlreadyWritten ? "after" : "before"} data write without refetching`, () => {
      const checkpoint = store()
      checkpoint.persistPage(parsed(1, item(1)))
      const pending = parsed(2, item(1) + item(2))
      checkpoint.progress.pendingPage = pending
      checkpoint.save()
      if (dataAlreadyWritten) writeFileSync(checkpoint.dataPath, JSON.stringify([checkpoint.data[0], pending.items[1]]))
      const recovered = new CheckpointStore(roots[0]!)
      expect(recovered.progress.nextPage).toBe(3)
      expect(recovered.progress.pendingPage).toBeUndefined()
      expect(recovered.progress.pages[1]?.addedCount).toBe(1)
      expect(recovered.data.map((entry) => entry.id)).toEqual(["bgm-1", "bgm-2"])
    })
  }

  test("recovers an interrupted empty-page transaction as completed", () => {
    const checkpoint = store()
    checkpoint.progress.pendingPage = parsed(1)
    checkpoint.save()
    const recovered = new CheckpointStore(roots[0]!)
    expect(recovered.progress.completed).toBe(true)
    expect(recovered.progress.firstEmptyPage).toBe(1)
  })

  test("does not overwrite corrupted raw data or accept a fake completed checkpoint", () => {
    const checkpoint = store()
    checkpoint.persistPage(parsed(1, item(1)))
    const p = checkpoint.progress
    p.completed = true
    checkpoint.save()
    expect(() => new CheckpointStore(roots[0]!)).toThrow("完成标记")
    p.completed = false
    checkpoint.save()
    writeFileSync(checkpoint.dataPath, JSON.stringify([] as Anime[]))
    expect(() => new CheckpointStore(roots[0]!)).toThrow("数量不一致")
  })
})

test("ConnectionRefused and timeout are retried finitely, never converted to zero items", async () => {
  for (const message of ["ConnectionRefused", "Timeout 30000ms exceeded"]) {
    let attempts = 0
    await expect(withRetries(async () => { attempts++; throw new Error(message) }, noDelay)).rejects.toThrow(message)
    expect(attempts).toBe(3)
  }
})
