/**
 * Convert a string to a URL-friendly slug.
 * Handles Portuguese characters (accents, ã, ç, etc.)
 *
 * Examples:
 *   "Câmera Dome VHL 1220 D"  → "camera-dome-vhl-1220-d"
 *   "5 sinais de que sua câmera está desatualizada" → "5-sinais-de-que-sua-camera-esta-desatualizada"
 */
export function slugify(text) {
  return text
    .normalize("NFD")                   // decompose: "ã" → "a" + combining tilde
    .replace(/[\u0300-\u036f]/g, "")   // strip combining diacritics
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")          // remove non-word chars (keep letters, digits, hyphens, spaces)
    .replace(/[\s_]+/g, "-")           // spaces / underscores → single hyphen
    .replace(/-+/g, "-")               // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");          // trim leading / trailing hyphens
}

/**
 * Generate a unique slug by appending -2, -3, … if the base slug already exists.
 *
 * @param {string} base          - The initial candidate slug.
 * @param {Function} existsFn    - Async fn(slug) → truthy if slug is already taken.
 * @returns {Promise<string>}
 */
export async function uniqueSlug(base, existsFn) {
  let slug = base;
  let i = 2;
  while (await existsFn(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
