type Anime = { id: number; name: string }
type LegacyAnime = { titleZh: string; titleEn: string; titleJa: string }
type Catalog = Record<string, Anime[]>
type StorageAccess = Pick<Storage, "getItem" | "setItem">

export const WATCHED_KEY = "selectedAnime"
export const WATCHED_BACKUP_KEY = "selectedAnime:before-bangumi-ids"
export const watchedKey = (id: number) => `bgm-${id}`

// Exact title matches only. Ambiguous titles stay untouched in storage.
export function buildWatchedAliases(catalog: Catalog, legacy: Record<string, LegacyAnime[]> = {}) {
  const candidates = new Map<string, Set<number>>()
  const add = (title: string, id: number) => {
    if (!title.trim()) return
    if (!candidates.has(title)) candidates.set(title, new Set())
    candidates.get(title)!.add(id)
  }
  for (const [year, items] of Object.entries(catalog)) {
    const yearNames = new Map<string, number[]>()
    for (const item of items) {
      add(item.name, item.id)
      yearNames.set(item.name, [...(yearNames.get(item.name) ?? []), item.id])
    }
    for (const old of legacy[year] ?? []) {
      for (const title of [old.titleZh, old.titleEn, old.titleJa]) {
        for (const id of yearNames.get(title) ?? []) add(old.titleZh, id)
      }
    }
  }
  const aliases = new Map<string, string>()
  for (const [title, ids] of candidates) {
    if (ids.size === 1) aliases.set(title, watchedKey([...ids][0]!))
  }
  return aliases
}

export function migrateWatchedState(value: unknown, aliases: Map<string, string>): string[] {
  if (!Array.isArray(value)) return []
  const result = new Set<string>()
  for (const entry of value) {
    if (typeof entry === "number" && Number.isSafeInteger(entry) && entry > 0) {
      result.add(watchedKey(entry))
    } else if (typeof entry === "string") {
      if (/^bgm-[1-9]\d*$/.test(entry)) result.add(entry)
      else result.add(aliases.get(entry) ?? entry)
    }
  }
  return [...result]
}

export function readWatchedState(storage: StorageAccess, aliases: Map<string, string>): string[] {
  const raw = storage.getItem(WATCHED_KEY)
  if (raw === null) return []
  let value: unknown
  try { value = JSON.parse(raw) } catch { value = null }
  const migrated = migrateWatchedState(value, aliases)
  if (JSON.stringify(migrated) !== raw && storage.getItem(WATCHED_BACKUP_KEY) === null) {
    // Preserve the original before the hook writes the migrated value.
    storage.setItem(WATCHED_BACKUP_KEY, raw)
  }
  return migrated
}
