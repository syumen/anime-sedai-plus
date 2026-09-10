import { load } from "cheerio"
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

export const YEAR = 2025 as const
export const MAX_ATTEMPTS = 3
export const PAGE_DELAY_MS = 750

export type Anime = {
  id: string
  bangumiId: number
  year: typeof YEAR
  title: string
  coverUrl: string | null
}

export type PageResult = {
  page: number
  url: string
  status: number
  items: Anime[]
  fetchedAt: string
}

type PageSummary = {
  page: number
  url: string
  status: number
  itemCount: number
  addedCount: number
  fetchedAt: string
}

export type Failure = {
  year: typeof YEAR
  page: number
  phase: string
  code: string
  message: string
  attempts: number
  status?: number
  at: string
}

export type Progress = {
  year: typeof YEAR
  region: "日本"
  category: "TV"
  nextPage: number
  completed: boolean
  firstEmptyPage: number | null
  sourceUrl: string | null
  total: number
  pages: PageSummary[]
  loginRequired: boolean
  lastError: Failure | null
  pendingPage?: PageResult
}

export class ScrapeError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public attempts = 1,
    public phase = "page",
  ) {
    super(message)
    this.name = "ScrapeError"
  }
}

export const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export function bgmUrl(value: string, base = "https://bgm.tv"): URL {
  const url = new URL(value, base)
  if (url.origin !== "https://bgm.tv" || url.username || url.password) {
    throw new ScrapeError("SOURCE", "分类页必须来自 https://bgm.tv")
  }
  return url
}

export function assertScope(value: string): URL {
  const url = bgmUrl(value)
  const parts = decodeURIComponent(url.pathname).split("/").filter(Boolean)
  const airtime = parts.indexOf("airtime")
  if (parts[0] !== "anime" || parts[1] !== "browser" ||
      !parts.includes("日本") || !parts.includes("tv") ||
      airtime < 0 || parts[airtime + 1] !== String(YEAR)) {
    throw new ScrapeError("SCOPE", "分类链接不同时包含日本、TV 和 2025，停止抓取")
  }
  return url
}

export function pageUrl(source: string, page: number): string {
  const url = assertScope(source)
  if (!Number.isSafeInteger(page) || page < 1) throw new ScrapeError("PAGE", "页码无效")
  url.searchParams.set("page", String(page))
  return url.href
}

export function inspectGate(html: string, url: string): "LOGIN_REQUIRED" | "SITE_CHALLENGE" | null {
  const $ = load(html)
  const title = $("title").text()
  const text = $("body").text()
  if (/just a moment|attention required|security verification|安全验证/i.test(title) ||
      $("#challenge-form, #challenge-running, #cf-challenge-running").length) {
    return "SITE_CHALLENGE"
  }
  if (/^\/login(?:\/|$)/.test(new URL(url).pathname) || $("input[type=password]").length ||
      /请先登录|需要登录|登录后才[能可]|log in to (?:view|continue)/i.test(text)) {
    return "LOGIN_REQUIRED"
  }
  return null
}

export function assertDocument(html: string, url: string, status: number): void {
  bgmUrl(url)
  const gate = inspectGate(html, url)
  if (gate) {
    throw new ScrapeError(gate, gate === "LOGIN_REQUIRED"
      ? "bgm.tv 要求人工登录"
      : "bgm.tv 返回站点安全验证页；未自动处理验证，也未判定为空页", status)
  }
  if (status < 200 || status >= 300) throw new ScrapeError("HTTP", `HTTP ${status}`, status)
  const $ = load(html)
  if ($("h1").length !== 1 || !$("h1").text().trim() ||
      $("#browserItemList").length !== 1 || !$("#browserItemList").is("ul, ol")) {
    throw new ScrapeError("STRUCTURE", "分类页标题或 #browserItemList 结构异常", status)
  }
  // A navigation/login/error shell without the complete category filters is not an empty list.
  for (const label of ["TV", "日本", "2025年"]) {
    if (!$("a[href]").toArray().some((a) => $(a).text().trim() === label)) {
      throw new ScrapeError("STRUCTURE", `分类页缺少筛选项：${label}`, status)
    }
  }
}

export function filterLink(html: string, currentUrl: string, label: string): string {
  const $ = load(html)
  const matches = $("a[href]").toArray().filter((a) => $(a).text().trim() === label)
  if (matches.length !== 1) throw new ScrapeError("STRUCTURE", `无法唯一定位筛选链接：${label}`)
  const href = $(matches[0]!).attr("href")!
  const url = bgmUrl(href, currentUrl)
  if (!url.pathname.startsWith("/anime/browser")) throw new ScrapeError("SCOPE", "筛选链接离开动画分类浏览")
  return url.href
}

export function coverUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null
  const url = new URL(value.trim(), "https://bgm.tv")
  if (!/^https?:$/.test(url.protocol) ||
      !["bgm.tv", "bangumi.tv"].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ||
      url.username || url.password) {
    throw new ScrapeError("COVER", "封面 URL 不是 bgm.tv / Bangumi 地址")
  }
  if (/\/no_icon_subject\.[a-z]+$/i.test(url.pathname)) return null
  return url.href
}

export function validateAnime(item: Anime): void {
  if (!Number.isSafeInteger(item.bangumiId) || item.bangumiId <= 0 ||
      item.id !== `bgm-${item.bangumiId}` || item.year !== YEAR ||
      typeof item.title !== "string" || !item.title.trim() || item.title.includes("\uFFFD")) {
    throw new ScrapeError("DATA", "动画 ID、年份或主要名称无效")
  }
  if (item.coverUrl !== null && (typeof item.coverUrl !== "string" || coverUrl(item.coverUrl) !== item.coverUrl)) {
    throw new ScrapeError("DATA", "封面地址无效")
  }
}

export function parsePage(html: string, finalUrl: string, status: number, requestedUrl: string): PageResult {
  assertDocument(html, finalUrl, status)
  const expected = assertScope(requestedUrl)
  const actual = assertScope(finalUrl)
  const page = Number(expected.searchParams.get("page") || "1")
  if (actual.pathname !== expected.pathname ||
      Number(actual.searchParams.get("page") || "1") !== page ||
      (actual.searchParams.get("sort") || "title") !== (expected.searchParams.get("sort") || "title")) {
    throw new ScrapeError("REDIRECT", "响应跳转至其他筛选条件或页码，不能作为当前页保存", status)
  }
  const $ = load(html)
  const list = $("#browserItemList")
  const rows = list.children("li.item")
  if (list.children().length !== rows.length || list.find("li").length !== rows.length ||
      (rows.length === 0 && list.text().trim())) {
    throw new ScrapeError("STRUCTURE", "动画列表条目结构异常，不能判定为空页", status)
  }
  const items = rows.toArray().map((row) => {
    const titleLink = $(row).find("h3 a.l[href]")
    if (titleLink.length !== 1) throw new ScrapeError("STRUCTURE", "动画条目缺少唯一主要名称链接", status)
    const subject = bgmUrl(titleLink.attr("href")!, finalUrl)
    const idMatch = subject.pathname.match(/^\/subject\/([1-9]\d*)\/?$/)
    if (!idMatch) throw new ScrapeError("STRUCTURE", "无法从 /subject/数字 链接提取 ID", status)
    const image = $(row).find("a.subjectCover img").first()
    const bangumiId = Number(idMatch[1])
    const item: Anime = {
      id: `bgm-${bangumiId}`,
      bangumiId,
      year: YEAR,
      title: titleLink.text().trim(),
      coverUrl: coverUrl(image.attr("data-src") || image.attr("src")),
    }
    validateAnime(item)
    return item
  })
  return { page, url: requestedUrl, status, items, fetchedAt: new Date().toISOString() }
}

function atomicJson(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true })
  const temp = `${path}.tmp`
  const fd = openSync(temp, "w")
  try {
    writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`, "utf8")
    fsyncSync(fd)
  } finally {
    closeSync(fd)
  }
  renameSync(temp, path)
}

export class CheckpointStore {
  readonly progressPath: string
  readonly dataPath: string
  progress: Progress
  data: Anime[]

  constructor(root: string) {
    this.progressPath = join(root, "SCRAPE_PROGRESS.json")
    this.dataPath = join(root, "data", "raw", "2025.json")
    this.data = existsSync(this.dataPath) ? JSON.parse(readFileSync(this.dataPath, "utf8")) : []
    if (!Array.isArray(this.data)) throw new ScrapeError("CHECKPOINT", "原始数据不是数组，未覆盖文件")
    this.data.forEach(validateAnime)
    if (new Set(this.data.map((item) => item.bangumiId)).size !== this.data.length) {
      throw new ScrapeError("CHECKPOINT", "原始数据包含重复 Subject ID，未覆盖文件")
    }
    if (existsSync(this.progressPath)) {
      this.progress = JSON.parse(readFileSync(this.progressPath, "utf8"))
      this.validateProgress()
      if (this.progress.pendingPage) this.finishPending()
      if (this.data.length !== this.progress.total) throw new ScrapeError("CHECKPOINT", "数据与 checkpoint 数量不一致，未重新抓取")
    } else {
      if (this.data.length) throw new ScrapeError("CHECKPOINT", "存在数据但缺少 checkpoint，未从第一页重抓")
      this.progress = {
        year: YEAR, region: "日本", category: "TV", nextPage: 1,
        completed: false, firstEmptyPage: null, sourceUrl: null,
        total: 0, pages: [], loginRequired: false, lastError: null,
      }
      atomicJson(this.dataPath, this.data)
      this.save()
    }
  }

  private validateProgress(): void {
    const p = this.progress
    if (p.year !== YEAR || p.region !== "日本" || p.category !== "TV" ||
        !Number.isSafeInteger(p.nextPage) || p.nextPage < 1 ||
        typeof p.completed !== "boolean" || !Array.isArray(p.pages) ||
        !Number.isSafeInteger(p.total) || p.total < 0 || p.nextPage !== p.pages.length + 1) {
      throw new ScrapeError("CHECKPOINT", "checkpoint 结构或抓取范围异常，未覆盖文件")
    }
    if (p.sourceUrl) assertScope(p.sourceUrl)
    let count = 0
    p.pages.forEach((entry, index) => {
      if (entry.page !== index + 1 || entry.status < 200 || entry.status >= 300 ||
          !Number.isSafeInteger(entry.itemCount) || entry.itemCount < 0 ||
          !Number.isSafeInteger(entry.addedCount) || entry.addedCount < 0 || entry.addedCount > entry.itemCount ||
          (entry.itemCount === 0 && (!p.completed || index !== p.pages.length - 1))) {
        throw new ScrapeError("CHECKPOINT", "已保存页记录异常，未猜测或跳页")
      }
      count += entry.addedCount
    })
    if (count !== p.total || (p.completed
      ? p.firstEmptyPage !== p.nextPage - 1 || p.pages.at(-1)?.itemCount !== 0
      : p.firstEmptyPage !== null)) {
      throw new ScrapeError("CHECKPOINT", "完成标记、首个空页或累计条目数不一致")
    }
    if (p.nextPage > 1 && !p.sourceUrl) throw new ScrapeError("CHECKPOINT", "缺少已验证的筛选 URL")
    if (p.pendingPage) this.validatePage(p.pendingPage)
  }

  save(): void { atomicJson(this.progressPath, this.progress) }

  setSource(value: string): void {
    const url = assertScope(value)
    url.searchParams.delete("page")
    this.progress.sourceUrl = url.href
    this.save()
  }

  private validatePage(result: PageResult): void {
    if (this.progress.completed || result.page !== this.progress.nextPage ||
        result.status < 200 || result.status >= 300 || !Array.isArray(result.items) ||
        !this.progress.sourceUrl || result.url !== pageUrl(this.progress.sourceUrl, result.page)) {
      throw new ScrapeError("CHECKPOINT", "当前页与 checkpoint 不一致，拒绝跳页保存")
    }
    result.items.forEach(validateAnime)
  }

  persistPage(result: PageResult): void {
    this.validatePage(result)
    // Write-ahead record: recovery completes this local transaction without another request.
    this.progress.pendingPage = result
    this.save()
    this.finishPending()
  }

  private finishPending(): void {
    const result = this.progress.pendingPage!
    this.validatePage(result)
    if (this.data.length < this.progress.total) throw new ScrapeError("CHECKPOINT", "已保存数据缺失，停止恢复")
    const ids = new Map(this.data.map((item) => [item.bangumiId, item]))
    for (const item of result.items) if (!ids.has(item.bangumiId)) ids.set(item.bangumiId, item)
    this.data = [...ids.values()]
    const addedCount = this.data.length - this.progress.total
    if (addedCount < 0 || addedCount > result.items.length) throw new ScrapeError("CHECKPOINT", "恢复中的条目数量异常")
    // Persist the cumulative raw data before advancing nextPage.
    atomicJson(this.dataPath, this.data)
    this.progress.pages.push({
      page: result.page, url: result.url, status: result.status,
      itemCount: result.items.length, addedCount, fetchedAt: result.fetchedAt,
    })
    this.progress.total = this.data.length
    this.progress.nextPage = result.page + 1
    this.progress.lastError = null
    if (result.items.length === 0) {
      this.progress.completed = true
      this.progress.firstEmptyPage = result.page
    }
    delete this.progress.pendingPage
    this.save()
  }

  recordFailure(error: unknown, phase = "page"): Failure {
    const detail = error instanceof ScrapeError ? error : new ScrapeError("RUNTIME", error instanceof Error ? error.message : String(error))
    // Never persist challenge tokens or authentication URL query strings in errors.
    const message = detail.message.replace(/https?:\/\/[^\s"<>]+/g, (value) => {
      try { const url = new URL(value); return `${url.origin}${url.pathname}` } catch { return "[URL]" }
    })
    const failure: Failure = {
      year: YEAR, page: this.progress.nextPage, phase: detail.phase === "page" ? phase : detail.phase,
      code: detail.code, message, attempts: detail.attempts,
      ...(detail.status === undefined ? {} : { status: detail.status }), at: new Date().toISOString(),
    }
    this.progress.lastError = failure
    if (detail.code === "LOGIN_REQUIRED") this.progress.loginRequired = true
    this.save()
    return failure
  }
}

export async function withRetries<T>(
  action: (attempt: number) => Promise<T>,
  pause: (ms: number) => Promise<void> = sleep,
  onRetry: (error: ScrapeError) => void = () => {},
): Promise<T> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try { return await action(attempt) } catch (error) {
      const detail = error instanceof ScrapeError ? error : new ScrapeError("NETWORK", error instanceof Error ? error.message : String(error))
      detail.attempts = attempt
      if (attempt === MAX_ATTEMPTS) throw detail
      onRetry(detail)
      await pause(attempt * 1000)
    }
  }
  throw new Error("Unreachable retry state")
}

export async function crawlPages(
  store: CheckpointStore,
  fetchPage: (url: string) => Promise<PageResult>,
  pause: (ms: number) => Promise<void> = sleep,
  onPage: (page: PageResult) => void = () => {},
): Promise<void> {
  try {
    while (!store.progress.completed) {
      if (!store.progress.sourceUrl) throw new ScrapeError("SCOPE", "缺少已验证的分类浏览 URL")
      const result = await fetchPage(pageUrl(store.progress.sourceUrl, store.progress.nextPage))
      store.persistPage(result)
      onPage(result)
      // Do not even schedule a request after the first successfully parsed empty page.
      if (store.progress.completed) break
      await pause(PAGE_DELAY_MS)
    }
  } catch (error) {
    store.recordFailure(error)
    throw error
  }
}
