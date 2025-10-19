import { invokeConfirmDialog } from "@/components/common/alert-dialog";
import {
  TreeNode,
  TreeNodeAction,
  TreeNodeTitle,
  type TreeNodeActionProps,
} from "@/components/common/tree";
import type { ModFile } from "@/libs/map-combo";
import { File, FilePlus, SquarePen, Trash2 } from "lucide-react";
import type { MouseEventHandler } from "react";
import { useCreateFile, useDeleteFile, useNomadFiles } from "../atoms/hooks";
import { useTranslation } from "react-i18next";
import { FileEditSheet } from "../edit-sheet/file";

// 创建逻辑已迁移到 hooks

function useFileTreeLocales() {
  const { t } = useTranslation("data-editor");
  return {
    create: t(($) => $["file"]["create"]),
    edit: t(($) => $.file.edit),
    delete: t(($) => $.file.delete),
    deleteConfirm: {
      title: t(($) => $.file["delete-confirm"].title),
      content: (fileName?: string) =>
        t(($) => $.file["delete-confirm"].content, { fileName }),
      confirm: t(($) => $.file["delete-confirm"].confirm),
      cancel: t(($) => $.file["delete-confirm"].cancel),
    },
    nomad: t(($) => $.file.nomad),
    count: (count: number) => t(($) => $.file["count"], { count }),
  };
}

export function FileCreateButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    modID?: string;
    onCreated?: (file: ModFile) => void;
  },
) {
  const { modID, onCreated, ...restProps } = props;
  const createFile = useCreateFile();
  const locales = useFileTreeLocales();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newFile = createFile(modID);
    onCreated?.(newFile);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={locales.create}
      {...restProps}
    >
      <FilePlus />
    </TreeNodeAction>
  );
}

function FileEditButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    fileName: string;
  },
) {
  const { fileName, ...restProps } = props;
  const locales = useFileTreeLocales();

  return (
    <FileEditSheet fileName={fileName}>
      <TreeNodeAction tooltip={locales.edit} {...restProps}>
        <SquarePen />
      </TreeNodeAction>
    </FileEditSheet>
  );
}

function FileDeleteButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    fileName?: string;
  },
) {
  const { fileName, ...restProps } = props;
  const deleteFile = useDeleteFile();
  const locales = useFileTreeLocales();

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const title = locales.deleteConfirm.title;
    const content = locales.deleteConfirm.content(fileName);
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
    deleteFile(fileName!);
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

export function FileTreeNode(props: { file: ModFile }) {
  const { file } = props;

  return (
    <TreeNode key={file.name} id={file.name}>
      <TreeNodeTitle>
        <File className="shrink-0 text-muted-foreground" />
        <div className="truncate">{file.name}</div>
      </TreeNodeTitle>
      <FileEditButton fileName={file.name} />
      <FileDeleteButton fileName={file.name} />
    </TreeNode>
  );
}

export function FileNomadListTreeNode() {
  const locales = useFileTreeLocales();

  const files = useNomadFiles();
  if (files.length === 0) {
    return <></>;
  }
  return (
    <TreeNode
      data-slot="nomad-files-tree-node"
      id="nomad-files"
      subNodes={files.map((file) => (
        <FileTreeNode key={file.name} file={file} />
      ))}
    >
      <TreeNodeTitle className="text-destructive/80">
        {locales.nomad}
        <span className="text-xs text-muted-foreground">
          {locales.count(files.length)}
        </span>
      </TreeNodeTitle>
    </TreeNode>
  );
}
