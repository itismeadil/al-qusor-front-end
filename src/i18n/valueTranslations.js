// Category and color names live in the database in whatever language the
// admin typed them in (currently English only). This dictionary lets the
// UI show an Arabic label for known values without touching the database
// or the product data itself.
//
// How to extend: add an entry here any time a new category or color name
// is introduced. Matching is case-insensitive. Anything not found here
// falls back to the original stored value — it will simply display in
// whatever language it was saved in, it won't break.

const valueTranslations = {
  // Categories
  table: "طاولة",
  tables: "طاولات",
  chair: "كرسي",
  chairs: "كراسي",
  "coffee table": "طاولة قهوة",
  "coffee tables": "طاولات قهوة",
  "dining table": "طاولة طعام",
  "dining tables": "طاولات طعام",
  "tea table": "طاولة شاي",
  "tea tables": "طاولات شاي",
  office: "مكتب",
  outdoor: "خارجي",
  sofa: "أريكة",
  sofas: "أرائك",
  storage: "تخزين",
  bedroom: "غرفة نوم",

  // Colors
  black: "أسود",
  white: "أبيض",
  grey: "رمادي",
  gray: "رمادي",
  brown: "بني",
  beige: "بيج",
  red: "أحمر",
  blue: "أزرق",
  green: "أخضر",
  yellow: "أصفر",
  gold: "ذهبي",
  silver: "فضي",
  navy: "كحلي",
  cream: "كريمي",
  tan: "بني فاتح",
  natural: "طبيعي",
  walnut: "جوزي",
  oak: "بلوط",
};

/**
 * Translates a category or color name for display.
 * Falls back to the original value when there's no known translation,
 * or when the current language is English.
 */
export const translateValue = (value, lang) => {
  if (!value) return value;
  if (lang !== "ar") return value;
  const key = value.trim().toLowerCase();
  return valueTranslations[key] || value;
};

export default valueTranslations;
