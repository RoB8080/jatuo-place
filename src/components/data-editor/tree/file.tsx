import { invokeConfirmDialog } from "@/components/common/alert-dialog";
import {
  TreeNode,
  TreeNodeAction,
  TreeNodeTitle,
  type TreeNodeActionProps,
} from "@/components/common/tree";
import { FormField } from "@/components/ui/form";
import type { MapComboData, ModFile } from "@/libs/map-combo";
import { File, FilePlus, SquarePen, Trash2 } from "lucide-react";
import type { MouseEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

function createNewFile(files: ModFile[], modID?: string): ModFile {
  let maxNewFileIDNumber = 0;
  files.forEach((file) => {
    const fileIDTextualNumber = file.name.match(/^New File (\d+)$/);
    if (fileIDTextualNumber) {
      const fileIDNumber = parseInt(fileIDTextualNumber[1]);
      if (fileIDNumber > maxNewFileIDNumber) {
        maxNewFileIDNumber = fileIDNumber;
      }
    }
  });

  const newFileNameNumber = maxNewFileIDNumber + 1;
  const newFileName = `New File ${newFileNameNumber}`;
  const newFile: ModFile = {
    name: newFileName,
    modID: modID || "",
  };

  return newFile;
}

export function FileCreateButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    modID?: string;
    onCreated?: (file: ModFile) => void;
  },
) {
  const { modID, onCreated, ...restProps } = props;
  const { getValues, setValue } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = getValues("files");
    const newFile = createNewFile(files, modID);
    setValue("files", [...files, newFile]);
    onCreated?.(newFile);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $["file"]["create"])}
      {...restProps}
    >
      <FilePlus />
    </TreeNodeAction>
  );
}

function FileEditButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    fileName?: string;
  },
) {
  const { fileName, ...restProps } = props;
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("Edit file:", fileName);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $.file.edit)}
      {...restProps}
    >
      <SquarePen />
    </TreeNodeAction>
  );
}

function FileDeleteButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    fileName?: string;
  },
) {
  const { fileName, ...restProps } = props;
  const { getValues, setValue } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const title = t(($) => $.file["delete-confirm"].title);
    const content = t(($) => $.file["delete-confirm"].content, { fileName });
    const confirmText = t(($) => $.file["delete-confirm"].confirm);
    const cancelText = t(($) => $.file["delete-confirm"].cancel);

    const confirmed = await invokeConfirmDialog({
      title,
      content,
      confirmText,
      cancelText,
    });
    if (!confirmed) {
      return;
    }
    const files = getValues("files");
    const newFiles = files.filter((file) => file.name !== fileName);
    setValue("files", newFiles);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $.file.delete)}
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
  const { control } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  return (
    <FormField
      control={control}
      name="files"
      render={({ field }) => {
        const files = field.value.filter((file) => !file.modID);

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
              {t(($) => $.file.nomad)}
              <span className="text-xs text-muted-foreground">
                {t(($) => $.file["count"], { count: files.length })}
              </span>
            </TreeNodeTitle>
          </TreeNode>
        );
      }}
    />
  );
}
