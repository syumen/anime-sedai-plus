import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const defaultRoot = fileURLToPath(new URL("../", import.meta.url));
export const SOURCE_FILENAME = "bgm_japan_tv_2006_2025_top50_rating_count.json";
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const validYear = (value) => /^(19|20)\d{2}$/.test(String(value)) ? String(value) : null;

export function subjectId(value) {
  if (typeof value !== "number" && typeof value !== "string") return null;
  const text = String(value).replace(/^bgm-/, "");
  if (!/^\d+$/.test(text)) return null;
  const id = Number(text);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function isBangumiCover(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      && !url.username && !url.password
      && /(^|\.)(bgm\.tv|bangumi\.tv|chii\.in)$/.test(url.hostname);
  } catch { return false; }
}

async function atomicWrite(filename, content) {
  await mkdir(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${process.pid}.tmp`;
  await writeFile(temporary, content, "utf8");
  await rename(temporary, filename);
}

// Only the selected local dataset is read. Old raw files never participate or act as a fallback.
export async function buildFromRaw({ projectRoot = defaultRoot } = {}) {
  const rawDirectory = path.join(projectRoot, "data/raw");
  const report = {
    source: `data/raw/${SOURCE_FILENAME}`,
    itemOrder: "explicit numeric rank ascending when supplied for every item; otherwise raw array order",
    /** @type {Array<{file: string, rawItems: number}>} */
    files: [],
    /** @type {Record<string, {rawItems: number, finalItems: number, duplicateIds: number, missingIds: number, invalidIds: number, missingNames: number, missingCovers: number, invalidCovers: number}>} */
    years: {},
    duplicateIds: [], missingIds: [], invalidIds: [], missingNames: [],
    missingCovers: [], invalidCovers: [], unknownYears: [], unreadableFiles: [],
    structuralErrors: [],
    totals: { rawItems: 0, finalAnime: 0, uniqueSubjectIds: 0, duplicateIds: 0,
      missingIds: 0, invalidIds: 0, missingNames: 0, missingCovers: 0, invalidCovers: 0 },
  };
  /** @type {Record<string, {id: number, bangumiId: number, year: number, title: string, coverUrl: string | null, name: string, cover: string | null, ratingCount?: number}[]>} */
  const data = {};
  const seen = new Map();

  function ensureYear(year) {
    data[year] ??= [];
    report.years[year] ??= { rawItems: 0, finalItems: 0, duplicateIds: 0,
      missingIds: 0, invalidIds: 0, missingNames: 0, missingCovers: 0, invalidCovers: 0 };
    if (!seen.has(year)) seen.set(year, new Map());
  }

  function readItems(items, context, file, location) {
    if (!Array.isArray(items)) {
      report.structuralErrors.push({ file, location, error: "Expected an items array" });
      return;
    }
    const inheritedYear = validYear(context.year);
    if (inheritedYear && (context.explicit || items.length === 0)) ensureYear(inheritedYear);
    const orderedItems = items.map((item, index) => ({ item, index }));
    if (items.length && items.every((item) => isObject(item) && typeof item.rank === "number" && Number.isFinite(item.rank))) {
      orderedItems.sort((a, b) => a.item.rank - b.item.rank);
    }
    for (const { item, index } of orderedItems) {
      report.totals.rawItems++;
      const reference = { file, location: `${location}[${index}]` };
      const explicit = isObject(item) && Object.hasOwn(item, "year");
      const year = explicit ? validYear(item.year) : inheritedYear;
      if (!year || (explicit && context.explicit && inheritedYear && year !== inheritedYear)) {
        report.unknownYears.push({ ...reference,
          year: explicit ? item.year : context.year ?? null,
          error: explicit && inheritedYear ? "Invalid or conflicting explicit year" : "No reliable year" });
      }
      const effectiveYear = year && !(explicit && context.explicit && inheritedYear && year !== inheritedYear) ? year : null;
      if (effectiveYear) {
        ensureYear(effectiveYear);
        report.years[effectiveYear].rawItems++;
        reference.year = effectiveYear;
      }
      const issue = (kind, detail = {}) => {
        report[kind].push({ ...reference, ...detail });
        report.totals[kind]++;
        if (effectiveYear) report.years[effectiveYear][kind]++;
      };
      const rawId = isObject(item) ? item.id ?? item.bangumiId : null;
      const id = subjectId(rawId);
      if (rawId === null || rawId === undefined || rawId === "") issue("missingIds");
      else if (id === null) issue("invalidIds", { value: rawId });
      const rawName = isObject(item) ? item.name ?? item.title : null;
      const name = typeof rawName === "string" ? rawName : "";
      if (!name.trim()) issue("missingNames", { id });
      const rawCover = isObject(item) ? item.cover ?? item.coverUrl : null;
      let cover = typeof rawCover === "string" && rawCover.trim() ? rawCover : null;
      if (cover === null) issue("missingCovers", { id });
      else {
        if (cover.startsWith("//")) cover = `https:${cover}`;
        if (!isBangumiCover(cover)) {
          issue("invalidCovers", { id, value: rawCover });
          cover = null;
        }
      }
      // Keep missing names/covers, but a record without a reliable year or ID cannot be keyed.
      if (!effectiveYear || id === null) continue;
      const yearIds = seen.get(effectiveYear);
      if (yearIds.has(id)) {
        issue("duplicateIds", { id, first: yearIds.get(id) });
        continue;
      }
      yearIds.set(id, reference);
      data[effectiveYear].push({
        id, bangumiId: id, year: Number(effectiveYear), title: name, coverUrl: cover,
        // Compatibility aliases preserve the existing frontend imports and watched keys.
        name, cover,
        ...(typeof item.ratingCount === "number" && Number.isFinite(item.ratingCount) && item.ratingCount >= 0
          ? { ratingCount: item.ratingCount } : {}),
      });
    }
  }

  for (const filename of [SOURCE_FILENAME]) {
    const file = `data/raw/${filename}`;
    let document;
    try {
      document = JSON.parse((await readFile(path.join(rawDirectory, filename), "utf8")).replace(/^\uFEFF/, ""));
    } catch (error) {
      report.unreadableFiles.push({ file, error: error.message });
      continue;
    }
    const yearsInFilename = [...new Set(filename.match(/(?<!\d)(?:19|20)\d{2}(?!\d)/g) ?? [])];
    const fallback = yearsInFilename.length === 1 ? yearsInFilename[0] : null;
    const before = report.totals.rawItems;
    if (Array.isArray(document)) {
      readItems(document, { year: fallback, explicit: false }, file, "$" );
    } else if (isObject(document) && isObject(document.years)) {
      for (const [year, group] of Object.entries(document.years)) {
        if (isObject(group) && Object.hasOwn(group, "year") && String(group.year) !== year) {
          report.unknownYears.push({ file, location: `$.years.${year}`, error: "Conflicting group year", year: group.year });
          readItems(group.items, { year: null, explicit: true }, file, `$.years.${year}.items`);
        } else {
          readItems(Array.isArray(group) ? group : group?.items, { year, explicit: true }, file, `$.years.${year}.items`);
        }
      }
    } else if (isObject(document) && Array.isArray(document.items)) {
      const explicit = Object.hasOwn(document, "year") || (isObject(document.meta) && Object.hasOwn(document.meta, "year"));
      const year = Object.hasOwn(document, "year") ? document.year : document.meta?.year ?? fallback;
      readItems(document.items, { year, explicit }, file, "$.items");
    } else {
      report.structuralErrors.push({ file, location: "$", error: "Expected an array, {items}, or {years}" });
      report.unknownYears.push({ file, location: "$", error: "Unrecognized document structure" });
    }
    report.files.push({ file, rawItems: report.totals.rawItems - before });
  }

  for (const [year, items] of Object.entries(data)) report.years[year].finalItems = items.length;
  const allItems = Object.values(data).flat();
  report.totals.finalAnime = allItems.length;
  report.totals.uniqueSubjectIds = new Set(allItems.map((item) => item.id)).size;
  report.dataset = {
    years: Object.keys(data),
    complete2006To2025: Object.keys(data).length === 20
      && Array.from({ length: 20 }, (_, index) => String(2006 + index)).every((year) => Object.hasOwn(data, year)),
    maxPerYear: Math.max(0, ...Object.values(data).map((items) => items.length)),
    withinTop50Limit: Object.values(data).every((items) => items.length <= 50),
  };
  report.status = allItems.length ? "built" : "no usable data; existing anime-data.js preserved";
  await atomicWrite(path.join(projectRoot, "data/build-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  if (!allItems.length) throw new Error(report.status);
  const output = `// Generated by scripts/build-from-raw.mjs from data/raw/${SOURCE_FILENAME}. Do not edit.\n`
    + "/** @typedef {{id: number, bangumiId: number, year: number, title: string, coverUrl: string | null, name: string, cover: string | null, ratingCount?: number}} AnimeItem */\n"
    + "/** @type {Record<string, AnimeItem[]>} */\n"
    + `const animeData = ${JSON.stringify(data, null, 2)};\n\nexport default animeData;\n`;
  await atomicWrite(path.join(projectRoot, "anime-data.js"), output);
  return { data, report };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { report } = await buildFromRaw();
    console.log(`Local raw build: ${report.files.length} files, ${Object.keys(report.years).length} years, ${report.totals.finalAnime} anime. Report: data/build-report.json`);
    const issues = report.totals.duplicateIds + report.totals.missingIds + report.totals.invalidIds
      + report.totals.missingNames + report.totals.missingCovers + report.totals.invalidCovers
      + report.unknownYears.length + report.unreadableFiles.length + report.structuralErrors.length;
    if (issues) console.warn(`Data quality notices: ${issues}. See the report; usable records were preserved.`);
  } catch (error) {
    console.error(`Local raw build failed: ${error.message}`);
    process.exitCode = 1;
  }
}
