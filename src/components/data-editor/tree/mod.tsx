import { invokeConfirmDialog } from "@/components/common/alert-dialog";
import {
  TreeNode,
  TreeNodeAction,
  TreeNodeTitle,
  type TreeNodeActionProps,
} from "@/components/common/tree";
import type { Mod } from "@/libs/map-combo";
import { Package, PackagePlus, SquarePen, Trash2 } from "lucide-react";
import type { MouseEventHandler } from "react";
import {
  useFilesByMod,
  useCreateMod,
  useDeleteMod,
  useNomadMods,
} from "../atoms/hooks";
import { useTranslation } from "react-i18next";
import { FileCreateButton, FileTreeNode } from "./file";
import { ModEditSheet } from "../edit-sheet/mod";

// 创建逻辑已迁移到 hooks

export function ModCreateButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID?: string;
    onCreated?: (mod: Mod) => void;
  },
) {
  const { categoryID, onCreated, ...restProps } = props;
  const createMod = useCreateMod();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newMod = createMod(categoryID);
    onCreated?.(newMod);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $["mod"]["create"])}
      {...restProps}
    >
      <PackagePlus />
    </TreeNodeAction>
  );
}

function ModEditButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    modID: string;
  },
) {
  const { modID, ...restProps } = props;
  const { t } = useTranslation("data-editor");

  return (
    <ModEditSheet modID={modID}>
      <TreeNodeAction tooltip={t(($) => $.mod.edit)} {...restProps}>
        <SquarePen />
      </TreeNodeAction>
    </ModEditSheet>
  );
}

function ModDeleteButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    modID?: string;
    modName?: string;
  },
) {
  const { modID, modName, ...restProps } = props;
  const deleteMod = useDeleteMod();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const title = t(($) => $.mod["delete-confirm"].title);
    const content = t(($) => $.mod["delete-confirm"].content, {
      modID,
      modName,
    });
    const confirmText = t(($) => $.mod["delete-confirm"].confirm);
    const cancelText = t(($) => $.mod["delete-confirm"].cancel);

    const confirmed = await invokeConfirmDialog({
      title,
      content,
      confirmText,
      cancelText,
    });
    if (!confirmed) {
      return;
    }

    deleteMod(modID!);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $.mod.delete)}
      variant="destructive"
      {...restProps}
    >
      <Trash2 />
    </TreeNodeAction>
  );
}

export function ModTreeNode(props: { mod: Mod }) {
  const { mod } = props;
  const files = useFilesByMod(mod.id);
  const { t } = useTranslation("data-editor");

  return (() => {
    return (
      <TreeNode
        className="sticky top-8 bg-background"
        key={mod.id}
        id={mod.id}
        subNodes={files.map((file) => (
          <FileTreeNode key={file.name} file={file} />
        ))}
      >
        <TreeNodeTitle>
          <Package className="shrink-0 text-muted-foreground" />
          <div className="truncate">{mod.name}</div>
          <div className="shrink-0 text-xs text-muted-foreground">
            {t(($) => $.file["count"], { count: files.length })}
          </div>
        </TreeNodeTitle>
        <FileCreateButton modID={mod.id} />
        <ModEditButton modID={mod.id} />
        <ModDeleteButton modID={mod.id} modName={mod.name} />
      </TreeNode>
    );
  })();
}

export function ModNomadListTreeNode() {
  const { t } = useTranslation("data-editor");
  const mods = useNomadMods();
  if (mods.length === 0) {
    return <></>;
  }
  return (
    <TreeNode
      className="sticky top-8"
      data-slot="category-nomad-tree-node"
      id="category-nomad"
      subNodes={mods.map((mod) => (
        <ModTreeNode key={mod.id} mod={mod} />
      ))}
    >
      <TreeNodeTitle className="text-destructive/80">
        {t(($) => $.mod.nomad)}
        <span className="text-xs text-muted-foreground">
          {t(($) => $.mod.count, { count: mods.length })}
        </span>
      </TreeNodeTitle>
    </TreeNode>
  );
}
