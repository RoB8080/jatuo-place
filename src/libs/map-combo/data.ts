import type { Condition } from "./condition";
import { z } from "zod";
import { localeMapSchema, type LocaleMap } from "./locale";

/**
 * Category of mod, used only for dividing mods into groups for better browser and selection experience
 * - locale namespace: `map-combo-data`
 * - locale key: `category.${id}.name`
 */
export interface ModCategory {
  /** ID of the mod category, defined by us, must be unique in a map combo */
  id: string;
  /** name of the category, locale map */
  name: LocaleMap;
}

export const modCategorySchema = z.object({
  id: z.string().min(1),
  name: localeMapSchema,
});

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
  /** Optional description, locale map */
  description?: LocaleMap;
  /** Optional tips, locale map */
  tips?: LocaleMap[];

  /** Mod available condition, if not true */
  condition?: Condition;
  /** ID of the belonged mod category */
  categoryID: string;
  /** Whether the mod is passive, if true, will not show in the mod selection */
  isPassive?: boolean;
}

/** Mod without recursive condition, used for tanstack form */
export type NonRecursiveMod = Omit<Mod, "condition"> & {
  condition?: Record<string, unknown>;
};

export const modSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string().optional(),
  version: z.string(),
  posterURL: z.string().optional(),
  mainPageURL: z.string().optional(),
  downloadURL: z.string().optional(),
  isPaid: z.boolean().optional(),
  description: localeMapSchema.optional(),
  tips: z.array(localeMapSchema).optional(),
  condition: z.custom<Condition>().optional(),
  categoryID: z.string(),
  isPassive: z.boolean().optional(),
});

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

/** Mod file without recursive condition, used for tanstack form */
export type NonRecursiveModFile = Omit<ModFile, "condition"> & {
  condition?: Record<string, unknown>;
};

export const modFileSchema = z.object({
  name: z.string(),
  posterURL: z.string().optional(),
  tips: z.string().optional(),
  condition: z.custom<Condition>().optional(),
  modID: z.string(),
});

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

export const mapComboDataSchema = z
  .object({
    categories: z.array(modCategorySchema),
    mods: z.array(modSchema),
    files: z.array(modFileSchema),
  })
  .superRefine((data, ctx) => {
    // every mod should have a valid category id
    const categoryIDs = data.categories.map((cat) => cat.id);
    const modIDs: string[] = [];
    for (const mod of data.mods) {
      modIDs.push(mod.id);
      if (!categoryIDs.includes(mod.categoryID)) {
        ctx.addIssue({
          code: "custom",
          message: `Mod category ID ${mod.categoryID} not found`,
          path: ["mods", data.mods.indexOf(mod), "categoryID"],
        });
      }
    }

    // every mod file should have a valid mod id
    for (const file of data.files) {
      if (!modIDs.includes(file.modID)) {
        ctx.addIssue({
          code: "custom",
          message: `Mod ID ${file.modID} not found`,
          path: ["files", data.files.indexOf(file), "modID"],
        });
      }
    }
  });
