type PressPoint = Pick<PointerEvent, "pointerId" | "clientX" | "clientY">
type PressStart = PressPoint & Pick<PointerEvent, "button" | "isPrimary">
type LoadCover = (url: string, ready: () => void, failed: () => void) => () => void

const preloadCover: LoadCover = (url, ready, failed) => {
  const image = new Image()
  image.referrerPolicy = "no-referrer"
  image.onload = ready
  image.onerror = failed
  image.src = url
  return () => { image.onload = null; image.onerror = null }
}

export function createCoverPreview(show: (url: string | null) => void, loadCover: LoadCover = preloadCover) {
  let active: { pointerId: number; x: number; y: number; startedAt: number; url: string | null; held: boolean; loaded: boolean } | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let detachImage: (() => void) | undefined
  let suppressNextClick = false

  const clear = () => {
    clearTimeout(timer)
    timer = undefined
    detachImage?.()
    detachImage = undefined
    active = null
    show(null)
  }
  const cancel = () => {
    if (active) suppressNextClick = true
    clear()
  }

  return {
    begin(event: PressStart, url: string | null) {
      if (!event.isPrimary || event.button !== 0) { cancel(); return false }
      clear()
      suppressNextClick = false
      const press = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startedAt: Date.now(), url, held: false, loaded: false }
      active = press
      timer = setTimeout(() => {
        if (active !== press) return
        press.held = true
        // Suppress the release click even if the image is absent, slow or broken.
        suppressNextClick = true
        if (press.loaded && press.url) show(press.url)
      }, 450)
      if (url) detachImage = loadCover(url, () => {
        if (active !== press) return
        press.loaded = true
        if (press.held) show(url)
      }, () => {
        if (active !== press) return
        press.loaded = false
        show(null)
      })
      return true
    },
    move(event: PressPoint) {
      if (active?.pointerId === event.pointerId && Math.hypot(event.clientX - active.x, event.clientY - active.y) > 10) cancel()
    },
    end(event: Pick<PointerEvent, "pointerId">) {
      if (active?.pointerId !== event.pointerId) return
      if (Date.now() - active.startedAt >= 450) suppressNextClick = true
      clear()
    },
    cancelPointer(event: Pick<PointerEvent, "pointerId">) {
      if (active?.pointerId === event.pointerId) cancel()
    },
    otherPointer(event: Pick<PointerEvent, "pointerId">) {
      if (active && active.pointerId !== event.pointerId) cancel()
    },
    consumeClick() {
      const suppress = Boolean(active?.held) || suppressNextClick
      suppressNextClick = false
      return suppress
    },
    allowKeyboardClick() { if (!active) suppressNextClick = false },
    cancel,
    dispose: clear,
  }
}
