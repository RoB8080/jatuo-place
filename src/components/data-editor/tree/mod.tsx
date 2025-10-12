import { invokeConfirmDialog } from "@/components/common/alert-dialog";
import {
  TreeNode,
  TreeNodeAction,
  TreeNodeTitle,
  type TreeNodeActionProps,
} from "@/components/common/tree";
import type { MapComboData, Mod } from "@/libs/map-combo";
import { Package, PackagePlus, SquarePen, Trash2 } from "lucide-react";
import type { MouseEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FileCreateButton, FileTreeNode } from "./file";
import { FormField } from "@/components/ui/form";

function createNewMod(mods: Mod[], categoryID?: string): Mod {
  let maxNewModIDNumber = 0;
  mods.forEach((mod) => {
    const modIDTextualNumber = mod.id.match(/^new_mod_(\d+)$/);
    if (modIDTextualNumber) {
      const modIDNumber = parseInt(modIDTextualNumber[1]);
      if (modIDNumber > maxNewModIDNumber) {
        maxNewModIDNumber = modIDNumber;
      }
    }
  });

  const newModIDNumber = maxNewModIDNumber + 1;
  const newModID = `new_mod_${newModIDNumber}`;
  const newMod: Mod = {
    id: newModID,
    categoryID: categoryID || "",
    name: `New Mod ${newModIDNumber}`,
    version: "0.0.1",
  };

  return newMod;
}

export function ModCreateButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID?: string;
    onCreated?: (mod: Mod) => void;
  },
) {
  const { categoryID, onCreated, ...restProps } = props;
  const { getValues, setValue } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const mods = getValues("mods");
    const newMod = createNewMod(mods, categoryID);
    setValue("mods", [...mods, newMod]);
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
    modID?: string;
  },
) {
  const { modID, ...restProps } = props;
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("Edit mod:", modID);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $.mod.edit)}
      {...restProps}
    >
      <SquarePen />
    </TreeNodeAction>
  );
}

function ModDeleteButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    modID?: string;
    modName?: string;
  },
) {
  const { modID, modName, ...restProps } = props;
  const { getValues, setValue } = useFormContext<MapComboData>();
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

    // Remove mod
    const mods = getValues("mods");
    const newMods = mods.filter((mod) => mod.id !== modID);
    setValue("mods", newMods);

    // Unassign files
    const files = getValues("files");
    const newFiles = files.map((file) => ({
      ...file,
      modID: file.modID === modID ? "" : file.modID,
    }));
    setValue("files", newFiles);
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
  const { control } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  return (
    <FormField
      control={control}
      name="files"
      render={({ field }) => {
        const files = field.value.filter((file) => file.modID === mod.id);

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
      }}
    />
  );
}

export function ModNomadListTreeNode() {
  const { t } = useTranslation("data-editor");
  const { control } = useFormContext<MapComboData>();
  return (
    <FormField
      control={control}
      name="mods"
      render={({ field }) => {
        const mods = field.value.filter((mod) => !mod.categoryID);
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
      }}
    />
  );
}
