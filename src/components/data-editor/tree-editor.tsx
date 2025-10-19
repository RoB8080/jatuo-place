import { useRef, useState } from "react";
import { useCategories, useMods, useFiles } from "./atoms/hooks";
import { cn } from "@/libs/utils";
import { TreeRoot } from "../common/tree";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ModNomadListTreeNode } from "./tree/mod";
import { FileNomadListTreeNode } from "./tree/file";
import { CategoryCreateButton, CategoryTreeNode } from "./tree/category";
import { EntitySearchPopover, type EntityPick } from "./entity/search-popover";

export interface TreeEditorProps {
  className?: string;
}

export function TreeEditor(props: TreeEditorProps) {
  "use no memo";
  const { className } = props;
  const categories = useCategories();
  const mods = useMods();
  const files = useFiles();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const categoriesByID = new Map(categories.map((c) => [c.id, c]));

  // 计算需要展开的层级 keys 与目标节点 fullID
  const computeExpandAndTarget = (pick: EntityPick) => {
    if (pick.kind === "mod") {
      const categoryID = pick.categoryID;
      if (!categoryID) {
        return {
          expandKeys: ["category-nomad"],
          targetID: `category-nomad-${pick.modID}`,
        };
      }
      return {
        expandKeys: [categoryID],
        targetID: `${categoryID}-${pick.modID}`,
      };
    } else {
      // file
      if (!pick.modID) {
        return {
          expandKeys: ["nomad-files"],
          targetID: `nomad-files-${pick.fileName}`,
        };
      }
      const mod = mods.find((m) => m.id === pick.modID);
      const categoryID = mod?.categoryID;
      if (categoryID) {
        return {
          expandKeys: [categoryID, `${categoryID}-${pick.modID}`],
          targetID: `${categoryID}-${pick.fileName}`,
        };
      }
      // mod 无分类但 file 有 mod，视为 nomad 模组下的文件
      return {
        expandKeys: ["category-nomad", `category-nomad-${pick.modID}`],
        targetID: `category-nomad-${pick.fileName}`,
      };
    }
  };

  const applyExpandAndScroll = (expandKeys: string[], targetID: string) => {
    setExpandedKeys((prev) => Array.from(new Set([...prev, ...expandKeys])));
    setTimeout(() => {
      const el = document.querySelector(
        `[data-tree-node-id="${CSS.escape(targetID)}"]`,
      );
      el?.scrollIntoView({ block: "center" });
      // flash background pulse using bg-accent
      const node = el as HTMLElement | null;
      if (node) {
        node.classList.remove("pulse-bg");
        void node.offsetWidth; // restart animation
        node.classList.add("pulse-bg");
        const handleAnimationEnd = (e: AnimationEvent) => {
          if (e.animationName !== "bg-pulse") return;
          node.classList.remove("pulse-bg");
          node.removeEventListener("animationend", handleAnimationEnd);
        };
        node.addEventListener("animationend", handleAnimationEnd);
      }
    }, 50);
  };

  return (
    <div
      data-slot="tree-editor"
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="flex shrink-0 items-center gap-2">
        <EntitySearchPopover
          mods={mods}
          files={files}
          categoriesByID={categoriesByID}
          onPick={(pick) => {
            const { expandKeys, targetID } = computeExpandAndTarget(pick);
            applyExpandAndScroll(expandKeys, targetID);
          }}
        />
        <CategoryCreateButton />
      </div>
      <ScrollArea className="min-h-0 flex-1" viewportRef={viewportRef}>
        <TreeRoot
          size="sm"
          className="flex flex-col"
          expandedKeys={expandedKeys}
          onExpandKeysChange={setExpandedKeys}
        >
          <>
            {categories.map((category, idx) => (
              <CategoryTreeNode
                index={idx}
                key={category.id}
                category={category}
              />
            ))}
            <ModNomadListTreeNode />
            <FileNomadListTreeNode />
          </>
        </TreeRoot>
        <ScrollBar
          className="z-[3]"
          data-slot="tree-editor-content-scrollbar"
          orientation="vertical"
          size="sm"
        />
      </ScrollArea>
    </div>
  );
}
