import { useEffect, useState } from "react"
import animeData from "../anime-data.js"
import legacyTitles from "../data/legacy-anime-titles"
import { buildWatchedAliases, readWatchedState, WATCHED_KEY } from "./watched-state"

const aliases = buildWatchedAliases(animeData, legacyTitles)

export function useWatchedAnime() {
  const [initial] = useState(() => {
    try {
      return { watched: readWatchedState(localStorage, aliases), canPersist: true }
    } catch (error) {
      console.warn("Unable to load saved watched records:", error)
      return { watched: [] as string[], canPersist: false }
    }
  })
  const [watched, setWatched] = useState(initial.watched)
  useEffect(() => {
    if (!initial.canPersist) return
    try {
      localStorage.setItem(WATCHED_KEY, JSON.stringify(watched))
    } catch (error) {
      console.warn("Unable to persist watched records:", error)
    }
  }, [watched, initial.canPersist])
  return [watched, setWatched] as const
}
