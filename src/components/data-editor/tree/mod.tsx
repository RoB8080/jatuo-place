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

function useModTreeLocales() {
  const { t } = useTranslation("data-editor");
  return {
    create: t(($) => $.mod.create),
    edit: t(($) => $.mod.edit),
    delete: t(($) => $.mod.delete),
    deleteConfirm: {
      title: t(($) => $.mod["delete-confirm"].title),
      content: (modID?: string, modName?: string) =>
        t(($) => $.mod["delete-confirm"].content, { modID, modName }),
      confirm: t(($) => $.mod["delete-confirm"].confirm),
      cancel: t(($) => $.mod["delete-confirm"].cancel),
    },
    nomad: t(($) => $.mod.nomad),
    modCount: (count: number) => t(($) => $.mod.count, { count }),
    fileCount: (count: number) => t(($) => $.file.count, { count }),
  };
}

export function ModCreateButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID?: string;
    onCreated?: (mod: Mod) => void;
  },
) {
  const { categoryID, onCreated, ...restProps } = props;
  const createMod = useCreateMod();
  const locales = useModTreeLocales();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newMod = createMod(categoryID);
    onCreated?.(newMod);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={locales.create}
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
  const locales = useModTreeLocales();

  return (
    <ModEditSheet modID={modID}>
      <TreeNodeAction tooltip={locales.edit} {...restProps}>
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
  const locales = useModTreeLocales();

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const title = locales.deleteConfirm.title;
    const content = locales.deleteConfirm.content(modID, modName);
    const confirmText = locales.deleteConfirm.confirm;
    const cancelText = locales.deleteConfirm.cancel;

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
      tooltip={locales.delete}
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
  const locales = useModTreeLocales();

  return (() => {
    return (
      <TreeNode
        className="sticky top-8 z-[1] bg-background"
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
            {locales.fileCount(files.length)}
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
  const locales = useModTreeLocales();
  const mods = useNomadMods();
  if (mods.length === 0) {
    return <></>;
  }
  return (
    <TreeNode
      className="sticky top-8 z-[1] bg-background"
      data-slot="category-nomad-tree-node"
      id="category-nomad"
      subNodes={mods.map((mod) => (
        <ModTreeNode key={mod.id} mod={mod} />
      ))}
    >
      <TreeNodeTitle className="text-destructive/80">
        {locales.nomad}
        <span className="text-xs text-muted-foreground">
          {locales.modCount(mods.length)}
        </span>
      </TreeNodeTitle>
    </TreeNode>
  );
}
