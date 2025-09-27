import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./en";
import { zh } from "./zh";
import { ru } from "./ru";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en,
  zh,
  ru,
};

export const defaultNS = "common";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    ns: ["common", "home"],
    defaultNS,
    supportedLngs: ["en", "zh", "ru"],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
