Current task: Long press cover preview complete

Dataset:
- bgm_japan_tv_2006_2025_top50_rating_count.json
- 2006–2025
- Top 50 by rating count per year
- 20 years, 50 anime per year, 1000 anime total
- Explicit Subject IDs from the updated raw JSON; original order preserved

Previous full dataset:
- no longer used by production build
- Old raw files retained

Completed:
- Pointer Events: 450ms hold previews coverUrl; release immediately hides the fixed overlay
- Short clicks still toggle watched; long presses and canceled gestures suppress their release click
- Movement beyond 10px, pointercancel, second pointer, scroll, blur and unmount clean up the preview
- Covers load only after pointerdown; slow/failed images never toggle watched or restore stale previews
- 10 preview tests and 13 existing tests passed; TypeScript check passed
- Direct Vite production build passed without running the data builder
- Existing anime-data.js, raw data, builder, watched storage and statistics logic were not changed

Browser verification:
- Initial image loads: 0; grid items: 1000
- Ordinary mouse clicks, watched/unwatched long presses, release clicks and image failure verified
- 390px viewport: 160px overlay, movement cancellation and browser scrolling verified
- Touch PointerEvents were simulated using a local image fixture; no Bangumi requests
- Multi-pointer events are not prevented; touch-action stays auto and the viewport permits scaling
- Physical two-finger pinch was not exercised by desktop automation

Next:
- Await the user's next task

Accepted states:
- 33 entries without covers are allowed; placeholders remain and no correction is needed
- 12 unmatched historical titles are allowed; saved names and backups remain, and the user may manually mark watched status later
- Neither item is a pending problem or follow-up task

Problems:
- None
