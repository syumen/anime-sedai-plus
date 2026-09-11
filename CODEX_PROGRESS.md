Current task: Yearly Top 50 dataset replacement complete

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
- anime-data.js regenerated from the single selected raw file
- No duplicate IDs, missing titles or missing cover URLs in the new dataset
- 13 local tests, TypeScript check and production build passed
- Browser verified: total 1000, watched toggle, green state, statistics and refresh persistence
- Watched IDs outside the Top 50 remain saved and are excluded from current statistics
- No network scraping, legacy migration rework or UI changes in this replacement

Next:
- UI review

Accepted states:
- 33 entries without covers are allowed; placeholders remain and no correction is needed
- 12 unmatched historical titles are allowed; saved names and backups remain, and the user may manually mark watched status later
- Neither item is a pending problem or follow-up task

Problems:
- None
