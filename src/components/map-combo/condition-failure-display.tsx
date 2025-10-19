import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle } from "lucide-react";
import type { ConditionResult } from "@/libs/map-combo/condition";
import type { Mod } from "@/libs/map-combo";

interface ConditionDisplayProps {
  conditionResult: ConditionResult;
  modMap: Map<string, Mod>;
}

interface ConditionDisplayItem {
  type: "mod" | "and" | "or" | "not" | "incompatible_mod";
  text: string;
  passed: boolean;
  level: number;
}

function getModName(modId: string, modMap: Map<string, Mod>): string {
  const mod = modMap.get(modId);
  return mod?.name || modId;
}

function getIcon(passed: boolean) {
  return passed ? (
    <CheckCircle className="size-4 text-green-600" />
  ) : (
    <XCircle className="size-4 text-destructive" />
  );
}

function getTextColor(passed: boolean): string {
  return passed ? "text-green-700" : "text-destructive";
}

function flattenConditionItems(
  conditions: ConditionResult[],
  modMap: Map<string, Mod>,
  translations: {
    and: string;
    or: string;
    not: string;
    incompatibleMod: string;
    requires: string;
  },
  level: number = 0,
): ConditionDisplayItem[] {
  const items: ConditionDisplayItem[] = [];

  for (const condition of conditions) {
    if (condition.type === "not" && condition.children?.[0]?.type === "mod") {
      // Special case: NOT + Mod = incompatible mod
      const modCondition = condition.children[0];
      items.push({
        type: "incompatible_mod",
        text: `${getModName(modCondition.value, modMap)} ${translations.incompatibleMod}`,
        passed: condition.passed,
        level,
      });
    } else {
      // Regular condition
      let text: string;
      switch (condition.type) {
        case "mod":
          text = `${translations.requires} ${getModName(condition.value, modMap)}`;
          break;
        case "and":
          text = translations.and;
          break;
        case "or":
          text = translations.or;
          break;
        case "not":
          text = translations.not;
          break;
        default:
          text = "Unknown condition";
      }

      items.push({
        type: condition.type,
        text,
        passed: condition.passed,
        level,
      });

      // Add children recursively
      if (condition.children && condition.children.length > 0) {
        items.push(
          ...flattenConditionItems(
            condition.children,
            modMap,
            translations,
            level + 1,
          ),
        );
      }
    }
  }

  return items;
}

function useConditionDisplayLocales() {
  const { t } = useTranslation("map-combo");
  return {
    and: t(($) => $["condition-display"].and),
    or: t(($) => $["condition-display"].or),
    not: t(($) => $["condition-display"].not),
    incompatibleMod: t(($) => $["condition-display"]["incompatible-mod"]),
    requires: t(($) => $["condition-display"].requires),
  };
}

export function ConditionDisplay({
  conditionResult,
  modMap,
}: ConditionDisplayProps) {
  const locales = useConditionDisplayLocales();

  if (!conditionResult) {
    return null;
  }

  // Prepare translations at the top level
  const translations = locales;

  const items = flattenConditionItems([conditionResult], modMap, translations);

  return (
    <div className="space-y-1 text-sm">
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 ${getTextColor(item.passed)}`}
          style={{ paddingLeft: `${item.level * 16}px` }}
        >
          {getIcon(item.passed)}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
