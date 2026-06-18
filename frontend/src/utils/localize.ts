import { Language } from "@/context/LanguageContext";

/**
 * Helper to get localized field value from database records
 * e.g. getLocalized(project, "title", "ar") resolves project.titleAr
 */
export function getLocalized<T = any>(
  record: T | null | undefined,
  field: string,
  lang: Language
): string {
  if (!record) return "";

  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1); // En, Ar, Tr
  const key = `${field}${capitalizedLang}` as keyof T;
  const fallbackKey = `${field}En` as keyof T;

  const val = record[key] || record[fallbackKey];
  return typeof val === "string" ? val : "";
}
