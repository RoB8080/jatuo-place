import {
  useMapComboContext,
  type DataTreeCategory,
  type DataTreeMod,
} from "./context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  CopyMinus,
  GitCommitVertical,
  Link,
  ListMinus,
  ListPlus,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { intersection } from "es-toolkit";
import { Checkbox } from "../ui/checkbox";
import { useMemo, type ReactElement, type ReactNode } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SimpleTooltip } from "../common";
import { SimpleHoverCard } from "../common/hover-card";
import { evaluateConditionTree } from "@/libs/map-combo/condition";
import { ConditionDisplay } from "./condition-failure-display";
import type { Mod } from "@/libs/map-combo";

function PaidMeta() {
  const { t } = useTranslation("map-combo");
  return (
    <span>
      <CircleDollarSign className="mr-0.5 inline-block size-3.5 align-[-1.5px]" />
      {t(($) => $["mod-tree"].paid)}
    </span>
  );
}

function ModHoverCard({
  mod,
  children,
  extraContent,
}: {
  mod: Mod;
  children: ReactElement;
  extraContent?: ReactNode;
}) {
  const {
    id,
    name,
    author,
    mainPageURL,
    isPaid,
    posterURL,
    hasDescription,
    version,
  } = mod;
  const { t } = useTranslation("map-combo-data");
  const desc = hasDescription
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      t(($) => ($.mod as any)[id].description)
    : undefined;

  const metaEls = useMemo(() => {
    const els: ReactElement[] = [];
    if (author) {
      els.push(
        <span key="author">
          <User className="mr-0.5 inline-block size-3.5 align-[-1.5px]" />
          {author}
        </span>,
      );
    }
    if (version) {
      els.push(
        <span key="version">
          <GitCommitVertical className="mr-0.5 inline-block size-3.5 align-[-1.5px]" />
          {version}
        </span>,
      );
    }
    if (isPaid) {
      els.push(<PaidMeta />);
    }

    return els.reduce<ReactElement[]>((acc, cur, idx) => {
      if (idx !== 0) {
        acc.push(<span> • </span>);
      }
      acc.push(cur);
      return acc;
    }, []);
  }, [author, isPaid]);

  return (
    <SimpleHoverCard
      align="start"
      alignOffset={12}
      content={
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-1">
            <h5 data-slot="mod-name">{name}</h5>
            {mainPageURL && (
              <a href={mainPageURL} target="_blank" rel="noopener noreferrer">
                <Button
                  className="-mt-0.5 -mr-0.5"
                  variant="link"
                  size="icon-xs"
                >
                  <Link />
                </Button>
              </a>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {metaEls}
          </div>
          <div className="mt-2 flex items-stretch gap-2">
            {posterURL && (
              <img className="h-18 rounded-md" src={posterURL} alt={name} />
            )}
            {desc ? (
              <p className="text-xs text-muted-foreground">{desc}</p>
            ) : null}
          </div>
          {extraContent}
        </div>
      }
    >
      {children}
    </SimpleHoverCard>
  );
}

function ModNode({ mod }: { mod: DataTreeMod }) {
  const { id, name, isPaid, condition } = mod;
  const { selectMods, unselectMods, selectedModIDs, modMap } =
    useMapComboContext();
  const isSelected = selectedModIDs.includes(id);
  const { t } = useTranslation("map-combo");

  const conditionEvaluation = useMemo(() => {
    if (!condition) {
      return { isDisabled: false, conditionResult: null };
    }

    const result = evaluateConditionTree(condition, new Set(selectedModIDs));
    return {
      isDisabled: !result.passed,
      conditionResult: result,
    };
  }, [condition, selectedModIDs]);

  const { isDisabled, conditionResult } = conditionEvaluation;
  const conditionDisplay =
    isDisabled && conditionResult ? (
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">
          {t(($) => $["mod-tree"]["unable-to-select"])}
        </div>
        <ConditionDisplay conditionResult={conditionResult} modMap={modMap} />
      </div>
    ) : null;

  return (
    <ModHoverCard mod={mod} extraContent={conditionDisplay}>
      <div
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 pr-2.5 pl-6 text-left hover:bg-accent"
        aria-disabled={isDisabled}
        onClick={() => {
          if (isDisabled) {
            return;
          }
          if (isSelected) {
            unselectMods([id]);
          } else {
            selectMods([id]);
          }
        }}
      >
        <div className="flex min-w-0 flex-auto items-center gap-2">
          <Checkbox checked={isSelected} disabled={isDisabled} />

          <span className="flex-auto truncate text-sm font-medium">{name}</span>
        </div>
        <div className="flex flex-none items-center gap-2">
          {isPaid && (
            <CircleDollarSign className="size-4 text-muted-foreground" />
          )}
          {isDisabled && conditionResult && (
            <CircleAlert className="size-4 text-destructive/70" />
          )}
        </div>
      </div>
    </ModHoverCard>
  );
}

function CategoryNode({ category }: { category: DataTreeCategory }) {
  const { id, mods } = category;
  const { t } = useTranslation("map-combo");
  const {
    toggleCategory,
    expandedCategoryIDs,
    selectMods,
    unselectMods,
    selectedModIDs,
  } = useMapComboContext();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const name = t(($) => ($["mod-category"] as any)[id].name, {
    ns: "map-combo-data",
  });

  const modIDs = useMemo(() => mods.map((mod) => mod.id), [mods]);
  const totalCount = modIDs.length;
  const selectedCount = intersection(modIDs, selectedModIDs).length;

  return (
    <Collapsible
      className="group"
      open={expandedCategoryIDs.includes(id)}
      onOpenChange={() => toggleCategory(id)}
    >
      <CollapsibleTrigger
        className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 pr-2.5 pl-2 text-left select-none  hover:bg-accent"
        asChild
      >
        <div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
            <span className="text-sm font-medium">{name}</span>
            <Badge variant="outline">
              {selectedCount ? `${selectedCount}/${totalCount}` : totalCount}
            </Badge>
          </div>
          <div>
            <SimpleTooltip content={t(($) => $["mod-tree"]["select-all"])}>
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  selectMods(modIDs);
                }}
              >
                <ListPlus />
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content={t(($) => $["mod-tree"]["unselect-all"])}>
              <Button
                size="xs"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  unselectMods(modIDs);
                }}
              >
                <ListMinus />
              </Button>
            </SimpleTooltip>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {mods.map((mod) => (
          <ModNode key={mod.id} mod={mod} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ModTree() {
  const { dataTree, collapseCategories } = useMapComboContext();
  const { t } = useTranslation("map-combo");

  const collapseAllCategories = () =>
    collapseCategories(dataTree.map((category) => category.id));

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between p-2 pl-3">
        <h5>{t(($) => $["mod-tree"].title)}</h5>
        <div className="flex items-center gap-2">
          <SimpleTooltip content={t(($) => $["mod-tree"]["fold-all"])}>
            <Button
              variant="ghost"
              onClick={collapseAllCategories}
              size="icon-xs"
            >
              <CopyMinus />
            </Button>
          </SimpleTooltip>
        </div>
      </div>
      {dataTree.map((category) => (
        <CategoryNode key={category.id} category={category} />
      ))}
    </div>
  );
}
