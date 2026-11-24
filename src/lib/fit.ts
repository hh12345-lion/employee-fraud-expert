/** Search-result limits used by audit tools such as Ahrefs. */
export const MAX_TITLE = 60;
export const MIN_TITLE = 30;
export const MAX_DESCRIPTION = 155;
export const MIN_DESCRIPTION = 110;
export const BRAND = "EmployeeFraudExpert";

/** Cut text at a word boundary so it fits, adding an ellipsis when shortened. */
export function clipText(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s&|-]+$/, "") + "…";
}

const SEPARATORS = [" | ", " — ", " – ", " - ", ": "];

/**
 * Shorten an over-long title without cutting words mid-phrase:
 * 1. drop the last " | …" / " - …" segment when what is left is still a meaningful title (30+ characters);
 * 2. otherwise drop trailing list items from that segment ("Kenya, Tanzania, Uganda & Rwanda" → "Kenya, Tanzania, Uganda");
 * 3. otherwise clip at a word boundary.
 */
export function shortenTitle(title: string, max = MAX_TITLE): string {
  let t = title.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const sep = SEPARATORS.find((s) => t.includes(s));
  if (sep) {
    const i = t.lastIndexOf(sep);
    const head = t.slice(0, i);
    if (head.length >= MIN_TITLE && head.length <= max) return head;
    let tail = t.slice(i + sep.length);
    while (head.length + sep.length + tail.length > max) {
      const j = Math.max(tail.lastIndexOf(", "), tail.lastIndexOf(" & "), tail.lastIndexOf(" and "));
      if (j <= 0) break;
      tail = tail.slice(0, j);
    }
    t = head.length + sep.length + tail.length <= max ? `${head}${sep}${tail}` : head;
    if (t.length <= max) return t;
  }
  // No separator: drop a trailing "& …" / ", …" phrase before clipping mid-sentence.
  let u = t;
  while (u.length > max) {
    const j = Math.max(u.lastIndexOf(", "), u.lastIndexOf(" & "));
    if (j < MIN_TITLE) break;
    u = u.slice(0, j);
  }
  return u.length <= max ? u : clipText(t, max);
}

/**
 * Fit a page title to 30–60 characters.
 * - A title that already ends in the brand loses the brand first when it is too long.
 * - mode "short": the brand is added only to titles under 30 characters ("Privacy Policy" → "Privacy Policy | Brand").
 * - mode "fit": the brand is added whenever "Page | Brand" still fits in 60 characters.
 */
export function fitTitle(title: string, mode: "short" | "fit" = "short", brand: string = BRAND): string {
  let t = title.replace(/\s+/g, " ").trim();
  for (const sep of SEPARATORS) {
    const suffix = `${sep}${brand}`;
    if (t.endsWith(suffix)) {
      if (t.length <= MAX_TITLE) return t;
      t = t.slice(0, -suffix.length);
      break;
    }
  }
  const withBrand = `${t} | ${brand}`;
  if ((mode === "fit" || t.length < MIN_TITLE) && withBrand.length <= MAX_TITLE) return withBrand;
  // A shortened title can end up under 30 characters ("FGM Country Expert Reports"); add the brand back when it fits.
  const short = shortenTitle(t);
  const branded = `${short} | ${brand}`;
  return short.length < MIN_TITLE && branded.length <= MAX_TITLE ? branded : short;
}

/** Appended to descriptions under 110 characters so they are not flagged as too short. */
const DESCRIPTION_EXTRA = "Forensic accountants for employee fraud investigations, disputes and litigation.";
const DESCRIPTION_EXTRA_SHORT = "Employee fraud expert evidence.";

/** Clip descriptions to 155 characters and pad very short ones with a sentence about the site. */
export function fitDescription(text: string): string {
  const d = clipText(text, MAX_DESCRIPTION);
  if (d.length >= MIN_DESCRIPTION) return d;
  const base = d.replace(/[.\s]*$/, ".");
  for (const e of [DESCRIPTION_EXTRA, DESCRIPTION_EXTRA_SHORT]) {
    const padded = `${base} ${e}`;
    if (padded.length <= MAX_DESCRIPTION + 5) return padded;
  }
  return d;
}
