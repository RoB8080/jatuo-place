import { useTranslation } from "react-i18next";
import { type SupportedLanguage, fallbackLanguage } from "../i18n";
import type { Condition } from "./condition";
import { useCallback } from "react";

/**
 * Map of locale strings used in Map Combo, must contain fallback language
 */
export type LocaleMap = Partial<Record<SupportedLanguage, string>> & {
  [fallbackLanguage]: string;
};

/** Get a localizer to localize a locale map */
export function useLocalizer(): (localeMap: LocaleMap) => string {
  const language = useTranslation().i18n.language as SupportedLanguage;
  return useCallback(
    (localeMap: LocaleMap) => {
      // Return the expected locale if it exists
      // Otherwise, return the fallback locale if it exists
      // As a last resort, return an empty string
      return localeMap[language] || localeMap[fallbackLanguage] || "";
    },
    [language],
  );
}

/**
 * Category of mod, used only for dividing mods into groups for better browser and selection experience
 * - locale namespace: `map-combo-data`
 * - locale key: `category.${id}.name`
 */
export interface ModCategory {
  /** ID of the mod category, defined by us, must be unique in a map combo */
  id: string;
  /** Local Map of name */
  name: LocaleMap;
}

/**
 * Data structure of a mod, it's a virtual entity, and may related to multiple mod files in game.
 * e.g. pro mods contains def, asset and map files.
 * - locale namespace: `map-combo-data`
 */
export interface Mod {
  /** ID of the mod, defined by us, must be unique in a map combo */
  id: string;
  /** Name of the mod, originally presented for better understanding */
  name: string;
  /** Author of the mod, originally presented for better understanding */
  author?: string;
  /** Version number of the mod */
  version: string;
  /** Poster image url of the mod */
  posterURL?: string;
  /** Main page link of the mod, if provided, will show a link to it */
  mainPageURL?: string;
  /** Download link of the mod */
  downloadURL?: string;
  /** Whether the mod is paid, expect to show a indicator */
  isPaid?: boolean;
  /** If this mod has description, if true, will locale it by `mod.${id}.description` */
  hasDescription?: boolean;
  /** If this mod has tips, if true, will locale it by `mod.${id}.tip` */
  hasTip?: boolean;

  /** Mod available condition, if not true */
  condition?: Condition;
  /** ID of the belonged mod category */
  categoryID: string;
  /** Whether the mod is passive, if true, will not show in the mod selection */
  isPassive?: boolean;
}

/**
 * Data structure of a mod file, representing an item in in-game mod manager
 */
export interface ModFile {
  /** Name of ModFile, use original name for better understanding */
  name: string;
  /** Poster image url of the mod file */
  posterURL?: string;
  /** Internal tips information of the mod*/
  tips?: string;

  /** Mod file activation condition, if true, it will appear in the mod file list */
  condition?: Condition;
  /** ID of the belonged mod */
  modID: string;
}

/**
 * Complete mod data structure
 */
export interface MapComboData {
  /**
   * Array of mod category configurations
   */
  categories: ModCategory[];

  /**
   * Array of mod configurations
   */
  mods: Mod[];

  /**
   * Array of mod file configurations
   */
  files: ModFile[];
}
