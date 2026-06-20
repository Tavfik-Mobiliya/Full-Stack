import { Language } from "@/context/LanguageContext";

/**
 * Helper to get localized field value from database records
 * e.g. getLocalized(project, "title", "ar") resolves project.titleAr
 */
export function getLocalized<T extends object>(
  record: T | null | undefined,
  field: string,
  lang: Language
): string {
  if (!record) return "";

  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1); // En, Ar, Tr
  const key = `${field}${capitalizedLang}`;
  const fallbackKey = `${field}En`;
  const safeRecord = record as Record<string, unknown>;

  const val = safeRecord[key] || safeRecord[fallbackKey];
  return typeof val === "string" ? val : "";
}
