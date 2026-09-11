import { afterEach, expect, jest as bunJest, test } from "bun:test"
import { createCoverPreview } from "./cover-preview"

// Bun 1.4 implements these APIs; the existing @types/bun predates their declarations.
const jest = bunJest as typeof bunJest & {
  useFakeTimers(): void
  useRealTimers(): void
  advanceTimersByTime(milliseconds: number): void
}

afterEach(() => jest.useRealTimers())

const down = { pointerId: 1, clientX: 100, clientY: 100, button: 0, isPrimary: true }
function fixture() {
  jest.useFakeTimers()
  let preview: string | null = null
  const requests: { url: string; ready: () => void; fail: () => void; detached: boolean }[] = []
  const press = createCoverPreview(url => { preview = url }, (url, ready, fail) => {
    const request = { url, ready, fail, detached: false }
    requests.push(request)
    return () => { request.detached = true }
  })
  return { press, requests, preview: () => preview }
}

test("does not load on initialization; a short press allows an immediate click", () => {
  const f = fixture()
  expect(f.requests).toHaveLength(0)
  f.press.begin(down, "cover-a")
  expect(f.requests).toHaveLength(1)
  f.requests[0]!.ready()
  jest.advanceTimersByTime(100)
  f.press.end(down)
  expect(f.preview()).toBeNull()
  expect(f.press.consumeClick()).toBe(false)
  jest.advanceTimersByTime(500)
  expect(f.preview()).toBeNull()
})

test("shows at 450ms, hides on release, and suppresses only the release click", () => {
  const f = fixture()
  f.press.begin(down, "cover-a")
  f.requests[0]!.ready()
  jest.advanceTimersByTime(449)
  expect(f.preview()).toBeNull()
  jest.advanceTimersByTime(1)
  expect(f.preview()).toBe("cover-a")
  f.press.end(down)
  expect(f.preview()).toBeNull()
  expect(f.press.consumeClick()).toBe(true)
  f.press.begin(down, "cover-a")
  f.press.end(down)
  expect(f.press.consumeClick()).toBe(false)
})

test("a long press never toggles watched, whether already watched or not", () => {
  for (const initial of [false, true]) {
    const f = fixture()
    let watched = initial
    f.press.begin(down, "cover-a")
    f.requests[0]!.ready()
    jest.advanceTimersByTime(450)
    expect(f.preview()).toBe("cover-a")
    f.press.end(down)
    if (!f.press.consumeClick()) watched = !watched
    expect(watched).toBe(initial)
  }
})

test("movement beyond 10px cancels a pending or visible preview and its click", () => {
  for (const elapsed of [100, 450]) {
    const f = fixture()
    f.press.begin(down, "cover-a")
    f.requests[0]!.ready()
    jest.advanceTimersByTime(elapsed)
    f.press.move({ ...down, clientX: 111 })
    jest.advanceTimersByTime(500)
    expect(f.preview()).toBeNull()
    expect(f.press.consumeClick()).toBe(true)
  }
})

test("a small diagonal move stays within tolerance; another pointer cancels pinch candidates", () => {
  const f = fixture()
  f.press.begin(down, "cover-a")
  f.requests[0]!.ready()
  f.press.move({ ...down, clientX: 106, clientY: 106 })
  jest.advanceTimersByTime(450)
  expect(f.preview()).toBe("cover-a")
  f.press.otherPointer({ pointerId: 2 })
  expect(f.preview()).toBeNull()
  expect(f.press.begin({ ...down, pointerId: 2, isPrimary: false }, "cover-b")).toBe(false)
  expect(f.requests).toHaveLength(1)
})

test("cancel, scroll/blur cancellation, and unmount detach pending image callbacks", () => {
  for (const stop of ["pointercancel", "scroll", "unmount"]) {
    const f = fixture()
    f.press.begin(down, "cover-a")
    if (stop === "pointercancel") f.press.cancelPointer(down)
    else if (stop === "unmount") f.press.dispose()
    else f.press.cancel()
    expect(f.requests[0]!.detached).toBe(true)
    f.requests[0]!.ready()
    jest.advanceTimersByTime(500)
    expect(f.preview()).toBeNull()
  }
})

test("slow, broken or absent images never let a long press turn into a watched click", () => {
  for (const kind of ["slow", "broken", "absent"]) {
    const f = fixture()
    f.press.begin(down, kind === "absent" ? null : "cover-a")
    if (kind === "broken") f.requests[0]!.fail()
    jest.advanceTimersByTime(450)
    expect(f.preview()).toBeNull()
    f.press.end(down)
    f.requests[0]?.ready()
    expect(f.preview()).toBeNull()
    expect(f.press.consumeClick()).toBe(true)
  }
})

test("a late image can appear only during its own active long press", () => {
  const f = fixture()
  f.press.begin(down, "cover-a")
  jest.advanceTimersByTime(450)
  f.requests[0]!.ready()
  expect(f.preview()).toBe("cover-a")
  f.press.end(down)
  f.press.begin(down, "cover-b")
  f.requests[0]!.ready()
  expect(f.preview()).toBeNull()
  f.requests[1]!.ready()
  jest.advanceTimersByTime(450)
  expect(f.preview()).toBe("cover-b")
})

test("right mouse button is ignored and a fresh keyboard activation remains usable", () => {
  const f = fixture()
  expect(f.press.begin({ ...down, button: 2 }, "cover-a")).toBe(false)
  expect(f.requests).toHaveLength(0)
  f.press.begin(down, "cover-a")
  jest.advanceTimersByTime(450)
  f.press.end(down)
  f.press.allowKeyboardClick()
  expect(f.press.consumeClick()).toBe(false)
})

test("extra clicks during a held long press cannot bypass suppression", () => {
  const f = fixture()
  f.press.begin(down, "cover-a")
  jest.advanceTimersByTime(450)
  f.press.allowKeyboardClick()
  expect(f.press.consumeClick()).toBe(true)
  expect(f.press.consumeClick()).toBe(true)
  f.press.end(down)
  expect(f.press.consumeClick()).toBe(true)
})
