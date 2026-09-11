import { expect, test } from "bun:test"
import { buildWatchedAliases, migrateWatchedState, readWatchedState, WATCHED_KEY, WATCHED_BACKUP_KEY } from "./watched-state"

const aliases = buildWatchedAliases({
  "2024": [{ id: 1, name: "原名" }, { id: 2, name: "同名" }],
  "2025": [{ id: 3, name: "同名" }, { id: 4, name: "Japanese title" }],
}, {
  "2025": [{ titleZh: "旧中文名", titleEn: "English title", titleJa: "Japanese title" }],
})

test("migrates exact names and legacy language aliases without guessing ambiguous titles", () => {
  expect(migrateWatchedState(["原名", "旧中文名", "同名", "目录外的旧记录", "bgm-50", 60, "原名"], aliases))
    .toEqual(["bgm-1", "bgm-4", "同名", "目录外的旧记录", "bgm-50", "bgm-60"])
})

test("preserves an original backup; repeated loading and an unwatch do not restore old marks", () => {
  const original = JSON.stringify(["原名", "旧中文名", "目录外的旧记录"])
  const values = new Map([[WATCHED_KEY, original]])
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  const first = readWatchedState(storage, aliases)
  expect(values.get(WATCHED_BACKUP_KEY)).toBe(original)
  storage.setItem(WATCHED_KEY, JSON.stringify(first.filter(key => key !== "bgm-1")))
  const reloaded = readWatchedState(storage, aliases)
  expect(reloaded).toEqual(["bgm-4", "目录外的旧记录"])
  expect(values.get(WATCHED_BACKUP_KEY)).toBe(original)
})

test("invalid stored shapes cannot crash the UI and malformed JSON is backed up", () => {
  for (const value of [null, {}, "bad", 1]) expect(migrateWatchedState(value, aliases)).toEqual([])
  const values = new Map([[WATCHED_KEY, "[malformed"]])
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  expect(readWatchedState(storage, aliases)).toEqual([])
  expect(values.get(WATCHED_BACKUP_KEY)).toBe("[malformed")
})

test("shared subject IDs across years migrate to one stable watched key", () => {
  const shared = buildWatchedAliases({ "2024": [{ id: 1, name: "A" }], "2025": [{ id: 1, name: "B" }] })
  expect(migrateWatchedState(["A", "B", "bgm-1"], shared)).toEqual(["bgm-1"])
})

test("changing to a smaller catalog preserves unseen subject IDs for a later full catalog", () => {
  const selected = ["bgm-1", "bgm-2", "bgm-999"]
  const values = new Map([[WATCHED_KEY, JSON.stringify(selected)]])
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
  const saved = readWatchedState(storage, new Map())
  const top50Ids = new Set(["bgm-1"])
  expect(saved).toEqual(selected)
  expect(saved.filter(id => top50Ids.has(id))).toEqual(["bgm-1"])
  expect(values.get(WATCHED_KEY)).toBe(JSON.stringify(selected))
  // Reintroducing a subject restores its display state without rewriting storage.
  expect(new Set(saved).has("bgm-2")).toBe(true)
})
