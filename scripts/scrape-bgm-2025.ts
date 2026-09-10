import { chromium, type BrowserContext, type Page } from "playwright-core"
import { createInterface } from "node:readline/promises"
import { fileURLToPath } from "node:url"
import { join } from "node:path"
import {
  CheckpointStore, PAGE_DELAY_MS, ScrapeError, YEAR, assertDocument,
  bgmUrl, crawlPages, filterLink, inspectGate, parsePage, sleep, withRetries,
} from "./bgm-scraper"

const root = fileURLToPath(new URL("../", import.meta.url))
let context: BrowserContext | undefined
let store: CheckpointStore | undefined

async function manualLogin(page: Page): Promise<void> {
  store!.progress.loginRequired = true
  store!.recordFailure(new ScrapeError("LOGIN_REQUIRED", "等待用户在可见浏览器中手动登录"))
  console.log("需要登录 bgm.tv，请在浏览器窗口中手动完成登录。")
  console.log("登录完成后回到终端按 Enter 继续。")
  if (!process.stdin.isTTY) throw new ScrapeError("LOGIN_REQUIRED", "请在交互式终端运行脚本以手动登录")
  await page.bringToFront()
  const terminal = createInterface({ input: process.stdin, output: process.stdout })
  try { await terminal.question("") } finally { terminal.close() }
}

async function readDocument<T>(page: Page, url: string, phase: string,
  parse: (html: string, finalUrl: string, status: number) => T): Promise<T> {
  bgmUrl(url)
  return withRetries(async (attempt) => {
    try {
      const response = await page.goto(url, { waitUntil: "load", timeout: 30_000 })
      if (!response) throw new ScrapeError("NETWORK", "页面未返回 HTTP 响应")
      const html = await page.content()
      const gate = inspectGate(html, page.url())
      if (gate === "LOGIN_REQUIRED") {
        if (attempt < 3) await manualLogin(page)
        throw new ScrapeError("LOGIN_REQUIRED", "登录后重新验证原页；仍未将页面保存为空页", response.status())
      }
      // Security challenges are errors. No automatic clicks, stealth flags, or challenge bypass.
      assertDocument(html, page.url(), response.status())
      const contentType = response.headers()["content-type"] || ""
      if (!contentType.includes("text/html")) throw new ScrapeError("STRUCTURE", "响应不是 HTML", response.status())
      return parse(html, page.url(), response.status())
    } catch (error) {
      const detail = error instanceof ScrapeError ? error : new ScrapeError("NETWORK", error instanceof Error ? error.message : String(error))
      detail.phase = phase
      throw detail
    }
  }, sleep, (error) => {
    console.error(`[${YEAR} page ${store!.progress.nextPage}] ${phase}: ${error.code}${error.status ? ` HTTP ${error.status}` : ""}; 重试 ${error.attempts}/3`)
  })
}

async function discoverSource(page: Page): Promise<string> {
  // Follow the site's actual filter links instead of inventing a region query parameter.
  let url = "https://bgm.tv/anime/browser"
  for (const label of ["TV", "日本", "2025年"]) {
    url = await readDocument(page, url, `filter:${label}`,
      (html, finalUrl) => filterLink(html, finalUrl, label))
    await sleep(PAGE_DELAY_MS)
  }
  return url
}

function printSummary(): void {
  const p = store!.progress
  const withCover = store!.data.filter((item) => item.coverUrl !== null).length
  console.log(JSON.stringify({
    year: YEAR, completed: p.completed, dataPages: p.pages.filter((page) => page.itemCount > 0).map((page) => page.page),
    firstEmptyPage: p.firstEmptyPage, total: store!.data.length, withCover,
    withoutCover: store!.data.length - withCover, nextPage: p.nextPage, loginRequired: p.loginRequired,
  }, null, 2))
}

try {
  if (process.argv.slice(2).length) throw new ScrapeError("SCOPE", "本阶段脚本仅支持 2025 日本 TV，不接受年份或其他参数")
  store = new CheckpointStore(root)
  if (store.progress.completed) {
    console.log("2025 已完成；读取 checkpoint，不发送页面请求。")
    printSummary()
  } else {
    context = await chromium.launchPersistentContext(join(root, ".bgm-browser-profile"), {
      channel: "msedge", headless: false, chromiumSandbox: true,
      acceptDownloads: false, viewport: { width: 1280, height: 900 }, timeout: 30_000,
    })
    // Read image URLs from HTML; do not download covers or visit subject details.
    await context.route("**/*", async (route) => {
      if (["image", "media", "font"].includes(route.request().resourceType())) await route.abort()
      else await route.continue()
    })
    const page = context.pages()[0] || await context.newPage()
    page.setDefaultTimeout(10_000)
    if (!store.progress.sourceUrl) store.setSource(await discoverSource(page))
    console.log(`从 checkpoint 继续：${YEAR} page ${store.progress.nextPage}`)
    await crawlPages(store,
      (url) => readDocument(page, url, "page", (html, finalUrl, status) => parsePage(html, finalUrl, status, url)),
      sleep,
      (result) => console.log(`[${YEAR} page ${result.page}] ${result.items.length} 条；已保存累计 ${store!.data.length} 条${result.items.length === 0 ? "；首个真实空页，立即停止" : ""}`),
    )
    printSummary()
  }
} catch (error) {
  if (store) console.error(JSON.stringify(store.recordFailure(error), null, 2))
  else console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
} finally {
  await context?.close()
}
