Current Stage: local anime covers complete

Dataset:
- 2006–2025; 50/year; 1000 total
- IDs, titles, years, order and ratingCount unchanged

Completed:
- 1000 existing .jpg covers matched by Bangumi Subject ID
- Missing: 0; extra: 0; remote fallback: 0
- Builder generates relative covers/{id}.jpg and keeps remote fallback when a file is absent
- Preview resolves local paths through import.meta.env.BASE_URL
- anime-data.js contains no lain.bgm.tv addresses
- Covers remain on demand; no initial image requests
- VPN left enabled; 5 different years verified with real local images
- Root and /anime-watch-table/ builds: 5 local HTTP 200 image requests each; no Bangumi image requests
- Long press release preserves watched state; existing interaction and UI unchanged
- 24 tests, TypeScript check and existing Bun build passed

Problems:
- None
