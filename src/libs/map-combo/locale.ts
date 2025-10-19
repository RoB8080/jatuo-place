import { z } from "zod";
import {
  fallbackLanguage,
  supportedLanguages,
  type SupportedLanguage,
} from "../i18n";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

/** Dict of locales used in Map Combo, must contain fallback language */
export type LocaleMap = Partial<Record<SupportedLanguage, string>> & {
  [fallbackLanguage]: string;
};

/** Schema of locale map */
export const localeMapSchema = z.object({
  [fallbackLanguage]: z.string().min(1, "Fallback language is required"),
  ...Object.fromEntries(
    Object.keys(supportedLanguages)
      .filter((key) => key !== fallbackLanguage)
      .map((key) => [key, z.string().optional()]),
  ),
});

/** Localize a locale map with given language */
export function localize(localeMap: LocaleMap, language: SupportedLanguage) {
  // Return the expected locale if it exists
  // Otherwise, return the fallback locale if it exists
  // As a last resort, return an empty string
  return localeMap[language] || localeMap[fallbackLanguage] || "";
}

/** Get a localizer to localize a locale map with current language */
export function useLocalizer(): (localeMap: LocaleMap) => string {
  const language = useTranslation().i18n.language as SupportedLanguage;
  return useCallback(
    (localeMap: LocaleMap) => localize(localeMap, language),
    [language],
  );
}
