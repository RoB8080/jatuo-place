import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ResponsiveCombobox } from "@/components/common/combobox";
import {
  createCondition,
  conditionToString,
  validateCondition,
  type Condition,
} from "@/libs/map-combo";
import { useMods } from "./atoms/hooks";

type ConditionEditorProps = {
  value?: Condition | Record<string, unknown>;
  onChange: (next?: Condition) => void;
};

function TypeSelector(props: { type: string; onChange: (t: string) => void }) {
  const { type, onChange } = props;
  const { t } = useTranslation("data-editor");
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t(($) => $.entity.conditionEditor.typeLabel)}
      </span>
      <Select value={type} onValueChange={(v) => onChange(v)}>
        <SelectTrigger size="sm" className="min-w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            {t(($) => $.entity.conditionEditor.types.none)}
          </SelectItem>
          <SelectItem value="mod">
            {t(($) => $.entity.conditionEditor.types.mod)}
          </SelectItem>
          <SelectItem value="and">
            {t(($) => $.entity.conditionEditor.types.and)}
          </SelectItem>
          <SelectItem value="or">
            {t(($) => $.entity.conditionEditor.types.or)}
          </SelectItem>
          <SelectItem value="not">
            {t(($) => $.entity.conditionEditor.types.not)}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function ConditionEditor(props: ConditionEditorProps) {
  const { value, onChange } = props;
  const { t } = useTranslation("data-editor");

  const mods = useMods();
  const normalized: Condition | undefined = useMemo(() => {
    if (!value) return undefined;
    return validateCondition(value) ? (value as Condition) : undefined;
  }, [value]);

  const currentType = normalized?.type ?? "none";

  const setType = (t: string) => {
    switch (t) {
      case "none":
        onChange(undefined);
        break;
      case "mod":
        onChange(createCondition.mod(""));
        break;
      case "and":
        onChange(createCondition.and(createCondition.mod("")));
        break;
      case "or":
        onChange(createCondition.or(createCondition.mod("")));
        break;
      case "not":
        onChange(createCondition.not(createCondition.mod("")));
        break;
    }
  };

  const modOptions = useMemo(
    () =>
      mods.map((m) => ({
        value: m.id,
        label: m.name,
        keywords: [m.id, m.name],
      })),
    [mods],
  );

  const setModValue = (next: string) => {
    if (!normalized || normalized.type !== "mod") return;
    onChange({ type: "mod", value: next });
  };

  const updateChild = (idx: number, next?: Condition) => {
    if (!normalized) return;
    if (normalized.type === "and" || normalized.type === "or") {
      const list = [...normalized.conditions];
      if (next) {
        list[idx] = next;
      } else {
        list.splice(idx, 1);
      }
      onChange({ ...normalized, conditions: list });
    } else if (normalized.type === "not") {
      if (!next) {
        // reset to a mod condition when clearing NOT child
        onChange(createCondition.not(createCondition.mod("")));
      } else {
        onChange({ type: "not", condition: next });
      }
    }
  };

  const addChild = () => {
    if (!normalized) return;
    if (normalized.type === "and" || normalized.type === "or") {
      onChange({
        ...normalized,
        conditions: [...normalized.conditions, createCondition.mod("")],
      });
    }
  };

  const changeSubType = (sub: Condition, newType: string): Condition => {
    switch (newType) {
      case "mod":
        return createCondition.mod(sub.type === "mod" ? sub.value : "");
      case "and":
        return createCondition.and(sub);
      case "or":
        return createCondition.or(sub);
      case "not":
        return createCondition.not(sub);
      default:
        return sub;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <TypeSelector type={currentType} onChange={setType} />

      {currentType === "none" ? (
        <div className="text-sm text-muted-foreground">
          {t(($) => $.entity.conditionEditor.noConditionHelp)}
        </div>
      ) : null}

      {normalized?.type === "mod" ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mod</span>
          <ResponsiveCombobox
            className="w-fit min-w-[140px]"
            options={modOptions}
            value={normalized.value}
            onChange={setModValue}
          />
        </div>
      ) : null}

      {normalized?.type === "and" || normalized?.type === "or" ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            {normalized.type === "and" ? "All of:" : "Any of:"}
          </div>
          <div className="flex flex-col gap-3 border-l pl-4">
            {normalized.conditions.map((child, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Child #{idx + 1}
                  </span>
                  <Select
                    value={child.type}
                    onValueChange={(t) =>
                      updateChild(idx, changeSubType(child, t))
                    }
                  >
                    <SelectTrigger size="sm" className="min-w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mod">Require Mod</SelectItem>
                      <SelectItem value="and">AND Group</SelectItem>
                      <SelectItem value="or">OR Group</SelectItem>
                      <SelectItem value="not">NOT</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateChild(idx)}
                  >
                    Remove
                  </Button>
                </div>
                <div className="pl-3">
                  <ConditionEditor
                    value={child}
                    onChange={(next) => updateChild(idx, next)}
                  />
                </div>
                {idx < normalized.conditions.length - 1 ? <Separator /> : null}
              </div>
            ))}
            <div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addChild}
              >
                Add Condition
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {normalized?.type === "not" ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">NOT this:</div>
          <div className="border-l pl-4">
            <ConditionEditor
              value={normalized.condition}
              onChange={(next) => updateChild(0, next)}
            />
          </div>
        </div>
      ) : null}

      {normalized ? (
        <div className="text-xs text-muted-foreground">
          {t(($) => $.entity.conditionEditor.previewLabel, {
            text: conditionToString(normalized),
          })}
        </div>
      ) : null}
    </div>
  );
}

export default ConditionEditor;
