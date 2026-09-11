Current Stage: GitHub Pages deployment configuration complete

Target:
- https://syumen.github.io/anime-sedai-plus/
- Production build and preview base: /anime-sedai-plus/
- Local development base: /

Completed:
- Official Pages Actions workflow for main pushes and workflow_dispatch
- Bun 1.4.2, frozen lockfile install, tests, TypeScript check and bun run build
- Uploads dist/ only; github-pages environment and required token permissions configured
- 24 tests, TypeScript and bun run build passed locally
- dist/index.html, JS/CSS assets and all 1000 covers verified
- Development and production subpath HTTP checks passed for HTML, assets and local cover
- Existing product logic, data, raw files and previous scraper work left unchanged

Remote:
- Workflow has not run remotely; no push or deployment performed
- Before the first deployment, repository Settings > Pages must use GitHub Actions as its source
