# anime-sedai

日本 TV 动画观看统计表，使用 React / Vite / Bun。正式构建只读取本地 `data/raw/bgm_japan_tv_2006_2025_top50_rating_count.json`。
该文件覆盖 2006–2025，已按每年评分人数筛选最多 50 部。以前的完整 raw 文件保留，但不参与构建，也不作为失败后的替代来源。
不运行 AniList、Bangumi API 或网页同步。构建过程不发起任何网络请求、不下载封面。

## 本地运行

已安装依赖的项目直接执行：

```powershell
& "C:\Users\surel\.bun\bin\bun.exe" run build:data
& "C:\Users\surel\.bun\bin\bun.exe" dev --host 127.0.0.1
& "C:\Users\surel\.bun\bin\bun.exe" run build
& "C:\Users\surel\.bun\bin\bun.exe" run test:local
```

`dev` 和 `build` 会先运行本地数据构建，避免页面读到过期的生成文件。无需安装新依赖。
前端实际入口是 `src/app.tsx`；生成的 `anime-data.js` 是按年份分组的 ES module：

```js
export default {
  "2025": [{
    id: 123456, bangumiId: 123456, year: 2025,
    title: "页面原名", coverUrl: "https://lain.bgm.tv/...",
    name: "页面原名", cover: "https://lain.bgm.tv/...", ratingCount: 1234
  }]
}
```

## raw 数据与顺序

- 支持条目数组、`{year, items}`、`{meta: {year}, items}` 和 `{years: {年份: {items}}}`（年份下也可直接放数组）。
- 条目支持 `id/name/cover`，也兼容 `bgm-ID`、`bangumiId/title/coverUrl`。生成数据包含 `id/bangumiId/year/title/coverUrl`，保留 `name/cover` 别名以兼容现有前端，不改变 import 或观看记录 key。已有 `ratingCount` 会保留，但不在 UI 展示。
- JSON 条目/容器的明确年份优先；没有 JSON 年份时，单年份文件才使用文件名中的唯一年份。多个年份或无年份的文件名不会被猜测；相互冲突的 JSON 年份会进入报告。
- 不扫描或合并其他 raw 文件。同一年重复 Subject ID 保留首次出现的位置，名称相同但 ID 不同的作品都保留。跨年的同一 ID 保留各自年份归属，并共享观看状态。
- 不重新计算 Top 50，保留当前文件的 `ratingCount` 降序数组。若所有条目明确提供数值 `rank`，则按 rank 升序；其余情况保留原序，不按 ID、名称或首播时间排序。
- 所有条目都展示，不再截取每年前 12 条。桌面保持按年排列的 12 列表格，小屏幕自动换列；浏览器缩放和手机双指缩放保持可用。

## 数据质量

每次生成 `data/build-report.json`，记录文件、每年原始/最终条目数、重复 ID、缺失/无效 ID、缺名称、缺封面、非法封面 URL、无法识别年份、结构错误和无法读取的 JSON。
报告里的问题计数以原始条目为准（包括随后去重或跳过的记录），`finalAnime` 是各年份最终条目数之和，`uniqueSubjectIds` 是跨年唯一作品数。

缺 ID、无效 ID 或年份无法确定的条目跳过，其余有效条目照常构建。缺名称保留空字符串，UI 显示 `#SubjectID`；缺封面保留 `null` 并显示占位。封面只接受 Bangumi 域名的 HTTP(S) URL，协议相对 URL 补 `https:`；非法 URL 记录后置为 `null`。名称不翻译、不清洗。
唯一指定 JSON 缺失、损坏或完全没有可用作品时，只写错误报告并失败，保留上一次的 `anime-data.js`，不会转用旧 raw。
生成文件通过临时文件原子替换，raw 原文件不被修改。封面展示使用 raw URL，浏览器在图片进入视野时加载，不进入作品详情页取图。

## 观看记录兼容

继续使用 LocalStorage 的 `selectedAnime` key，未来记录使用 `bgm-SubjectID`。
旧的名称记录通过当前作品名称，以及 `data/legacy-anime-titles.ts` 中历史中/英/日名称的同年精确匹配，迁移到唯一 Subject ID。
原始值在第一次迁移前备份为 `selectedAnime:before-bangumi-ids`。取消已看不会在刷新时从备份重新导入。
无法唯一匹配或已不在当前清单中的旧名称仍保留在 `selectedAnime`，不会被当成其他作品，也不会自动计入已看统计；必要时可人工按 ID 重新标记。旧目录文件只用于迁移，不参与作品清单生成或页面列表。
过去的 12 个未匹配旧名称和 33 个旧数据缺封面已由用户接受，不作为本轮待办，不重新处理旧迁移报告。
已有 `bgm-ID` 即使不在当前 Top 50 里仍保存在 LocalStorage，只是不显示、不计入当前统计。以后重新引入相同 ID 时可以恢复已看显示。
年份范围与语言仍沿用原 LocalStorage key；语言切换只影响界面文字，动画名称忠实使用 raw 中的名称。

## 已停用的网络脚本

`init-data.ts`、`scripts/scrape-bgm-2025.ts` 和 `scripts/bgm-scraper.ts` 保留为 deprecated 历史代码，已从正式命令中移除。不要运行它们来更新当前清单。
旧 `SCRAPE_PROGRESS.json` 不是本地构建输入。`.bgm-browser-profile/` 仍被 Git 忽略，认证数据不参与生成或提交。
