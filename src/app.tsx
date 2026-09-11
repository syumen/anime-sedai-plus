import { useMemo, useRef, useEffect, useState } from "react"
import animeData from "../anime-data.js"
import { domToBlob } from "modern-screenshot"
import { toast } from "sonner"
import { usePersistState } from "./hooks"
import { useI18n } from "./i18n-context"
import { LanguageToggle } from "./LanguageToggle"
import { useWatchedAnime } from "./use-watched-anime"
import { watchedKey } from "./watched-state"
import { createCoverPreview } from "./cover-preview"

type YearRange = "5" | "10" | "15" | "all"

const yearRangeOptions: YearRange[] = ["5", "10", "15", "all"]
const allYears = Object.keys(animeData).sort((a, b) => Number(a) - Number(b))

export const App = () => {
  const { t, language } = useI18n()
  const [watchedAnime, setWatchedAnime] = useWatchedAnime()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const coverPreview = useMemo(() => createCoverPreview(setPreviewUrl), [])
  useEffect(() => {
    // Capture covers release outside the button; passive listeners preserve native gestures.
    window.addEventListener("pointerdown", coverPreview.otherPointer, { capture: true, passive: true })
    window.addEventListener("pointermove", coverPreview.move, { passive: true })
    window.addEventListener("pointerup", coverPreview.end, { passive: true })
    window.addEventListener("pointercancel", coverPreview.cancelPointer, { passive: true })
    window.addEventListener("scroll", coverPreview.cancel, { capture: true, passive: true })
    window.addEventListener("blur", coverPreview.cancel)
    return () => {
      window.removeEventListener("pointerdown", coverPreview.otherPointer, true)
      window.removeEventListener("pointermove", coverPreview.move)
      window.removeEventListener("pointerup", coverPreview.end)
      window.removeEventListener("pointercancel", coverPreview.cancelPointer)
      window.removeEventListener("scroll", coverPreview.cancel, true)
      window.removeEventListener("blur", coverPreview.cancel)
      coverPreview.dispose()
    }
  }, [coverPreview])
  const [yearRange, setYearRange] = usePersistState<YearRange>(
    "yearRange",
    "all"
  )

  const visibleYears = useMemo(() => {
    if (yearRange === "all") {
      return allYears
    }

    return allYears.slice(-Number(yearRange))
  }, [yearRange])

  const visibleAnimeKeys = useMemo(() => {
    return visibleYears.flatMap((year) => {
      const items = animeData[year] || []
      return items.map((item) => watchedKey(item.id))
    })
  }, [visibleYears])

  const visibleAnimeKeySet = useMemo(() => {
    return new Set(visibleAnimeKeys)
  }, [visibleAnimeKeys])

  const watchedAnimeKeySet = useMemo(() => new Set(watchedAnime), [watchedAnime])
  const watchedCount = visibleAnimeKeys.filter((key) => {
    return watchedAnimeKeySet.has(key)
  }).length

  const getYearRangeLabel = (option: YearRange) => {
    switch (option) {
      case "5":
        return t("last5Years")
      case "10":
        return t("last10Years")
      case "15":
        return t("last15Years")
      case "all":
        return t("allYears")
    }
  }

  const wrapper = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = t("title")
  }, [language, t])

  const imageToBlob = async () => {
    if (!wrapper.current) return

    const blob = await domToBlob(wrapper.current, {
      scale: 2,
      filter(el) {
        if (el instanceof HTMLElement && el.classList.contains("remove")) {
          return false
        }
        return true
      },
    })

    return blob
  }

  const copyImage = async () => {
    const blob = await imageToBlob()

    if (!blob) return

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ])
  }

  const downloadImage = async () => {
    if (!wrapper.current) return

    const blob = await imageToBlob()

    if (!blob) return

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "anime-sedai.png"
    a.click()

    URL.revokeObjectURL(url)
  }

  const totalAnime = visibleAnimeKeys.length
  const watchedPercentage = (
    totalAnime === 0 ? 0 : (watchedCount / totalAnime) * 100
  ).toFixed(2)

  return (
    <>
      <div className="flex flex-col gap-4 pb-10">
        <div className="px-2 py-3 md:p-4 flex flex-col md:items-center">
          <div
            className="self-start mb-2 text-sm text-green-700 tabular-nums"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="font-bold">
              {t("watchedCount", { count: watchedCount, total: totalAnime })}
            </div>
            <div className="text-xs">{watchedPercentage}%</div>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 mb-3 md:justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t("yearRange")}:</span>
              <select
                className="border rounded px-2 py-1 text-sm bg-white"
                value={yearRange}
                onChange={(e) => {
                  setYearRange(e.currentTarget.value as YearRange)
                }}
              >
                {yearRangeOptions.map((option) => (
                  <option key={option} value={option}>
                    {getYearRangeLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            <LanguageToggle />
          </div>
          <div className="w-full min-w-0">
            <div
              className="anime-catalog flex flex-col border border-b-0 bg-white mx-auto"
              ref={wrapper}
            >
              <div className="border-b justify-between p-2 text-sm md:text-base font-bold flex">
                <h1 className="min-w-0 break-words">
                  {t("title")}
                  <span className="remove"> - {t("subtitle")}</span>
                  <span className="ml-2 text-zinc-400 font-medium">
                    {t("website")}
                  </span>
                </h1>
              </div>
              {visibleYears.map((year) => {
                const items = animeData[year] || []
                return (
                  <div key={year} className="flex border-b" data-year={year}>
                    <div className="anime-year-label bg-red-500 shrink-0 text-white flex items-center font-bold justify-center p-1">
                      <span>{year}</span>
                    </div>
                    <div className="anime-year-items">
                      {items.map((item) => {
                        const animeKey = watchedKey(item.id)
                        const displayTitle = item.name.trim() ? item.name : `#${item.id}`
                        const isWatched = watchedAnimeKeySet.has(animeKey)
                        return (
                          <button
                            key={animeKey}
                            type="button"
                            data-anime-id={item.id}
                            aria-label={displayTitle}
                            aria-pressed={isWatched}
                            className={`
                              anime-cell break-words text-center flex flex-col items-center
                              overflow-hidden cursor-pointer
                              ${
                                isWatched
                                  ? "bg-green-500 text-black"
                                  : "hover:bg-zinc-100"
                              }
                              transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-green-800
                            `}
                            title={displayTitle}
                            onPointerDown={(event) => {
                              const coverUrl = item.coverUrl?.startsWith("covers/")
                                ? `${import.meta.env.BASE_URL}${item.coverUrl}`
                                : item.coverUrl
                              if (coverPreview.begin(event, coverUrl)) {
                                event.currentTarget.setPointerCapture(event.pointerId)
                              }
                            }}
                            onPointerMove={coverPreview.move}
                            onPointerUp={coverPreview.end}
                            onPointerCancel={coverPreview.cancelPointer}
                            onLostPointerCapture={coverPreview.cancelPointer}
                            onContextMenu={(event) => event.preventDefault()}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") coverPreview.allowKeyboardClick()
                            }}
                            onClick={() => {
                              if (coverPreview.consumeClick()) return
                              setWatchedAnime((prev) => {
                                if (prev.includes(animeKey)) {
                                  return prev.filter(
                                    (title) => title !== animeKey
                                  )
                                }
                                return [...prev, animeKey]
                              })
                            }}
                          >
                            <span className="leading-snug w-full line-clamp-2">
                              {displayTitle}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center px-4">
          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              setWatchedAnime((prev) => {
                const hiddenWatchedAnime = prev.filter((title) => {
                  return !visibleAnimeKeySet.has(title)
                })

                return [...new Set([...hiddenWatchedAnime, ...visibleAnimeKeys])]
              })
            }}
          >
            {t("selectAll")}
          </button>

          {watchedCount > 0 && (
            <button
              type="button"
              className="border rounded-md px-4 py-2 inline-flex"
              onClick={() => {
                setWatchedAnime((prev) => {
                  return prev.filter((title) => !visibleAnimeKeySet.has(title))
                })
              }}
            >
              {t("clear")}
            </button>
          )}

          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              toast.promise(copyImage(), {
                success: t("copySuccess"),
                loading: t("copying"),
                error(error) {
                  return t("copyFailed", {
                    error:
                      error instanceof Error
                        ? error.message
                        : t("unknownError"),
                  })
                },
              })
            }}
          >
            {t("copyImage")}
          </button>

          <button
            type="button"
            className="border rounded-md px-4 py-2 inline-flex"
            onClick={() => {
              toast.promise(downloadImage(), {
                success: t("downloadSuccess"),
                loading: t("downloading"),
                error(error) {
                  return t("downloadFailed", {
                    error:
                      error instanceof Error
                        ? error.message
                        : t("unknownError"),
                  })
                },
              })
            }}
          >
            {t("downloadImage")}
          </button>
        </div>

        <div className="mt-2 text-center">
          {t("footer")}
          <a
            href={
              language === "zh"
                ? "https://x.com/localhost_4173"
                : "https://x.com/localhost_5173"
            }
            target="_blank"
            className="underline"
          >
            {language === "zh" ? "低空飞行" : "egoist"}
          </a>
          {t("madeBy")}
          <a
            href="https://github.com/egoist/anime-sedai"
            target="_blank"
            className="underline"
          >
            {t("viewCode")}
          </a>
        </div>

        {language === "en" && (
          <div className="text-center text-sm text-gray-600">
            English version is translated by{" "}
            <a
              href="https://mhh0318.github.io/"
              target="_blank"
              className="underline"
            >
              h1t
            </a>
          </div>
        )}
      </div>
      {previewUrl && (
        <img
          className="cover-preview"
          src={previewUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          referrerPolicy="no-referrer"
          onError={() => setPreviewUrl((current) => current === previewUrl ? null : current)}
        />
      )}
    </>
  )
}
