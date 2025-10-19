import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { z } from "zod";

export type SupportedLanguage = "en" | "zh" | "ru";
export const supportedLanguages: SupportedLanguage[] = ["en", "zh", "ru"];
export const fallbackLanguage = "en" satisfies SupportedLanguage;

export type I18NextResources = {
  common: typeof import("../../public/locales/en/common.json");
  global: typeof import("../../public/locales/en/global.json");
  home: typeof import("../../public/locales/en/home.json");
  auth: typeof import("../../public/locales/en/auth.json");
  "map-combo": typeof import("../../public/locales/en/map-combo.json");
  "data-editor": typeof import("../../public/locales/en/data-editor.json");
};

export const defaultNS = "common";
export type DefaultNS = typeof defaultNS;

async function configZodLocale(lng: string) {
  let resolvedLng: "zhCN" | "en" | "ru" = "en";
  if (lng === "zh") {
    resolvedLng = "zhCN";
  } else if (lng === "ru") {
    resolvedLng = "ru";
  }

  const locales = await import(`zod/v4/locales`);
  const zodConfig = locales[resolvedLng]();

  console.debug("configZodLocale", resolvedLng, zodConfig);
  z.config(zodConfig);
}

i18n.on("languageChanged", (lng: string) => {
  configZodLocale(lng);
});

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
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
