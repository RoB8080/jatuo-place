import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

export type SupportedLanguage = "en" | "zh" | "ru";
export const supportedLanguages: SupportedLanguage[] = ["en", "zh", "ru"];
export const fallbackLanguage = "en" satisfies SupportedLanguage;

export type I18NextResources = {
  common: typeof import("../../public/locales/en/common.json");
  global: typeof import("../../public/locales/en/global.json");
  home: typeof import("../../public/locales/en/home.json");
  "map-combo": typeof import("../../public/locales/en/map-combo.json");
};

export const defaultNS = "common";
export type DefaultNS = typeof defaultNS;

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    supportedLngs: supportedLanguages,
    fallbackLng: fallbackLanguage,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    partialBundledLanguages: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {},
    defaultNS,
  });

export default i18n;
