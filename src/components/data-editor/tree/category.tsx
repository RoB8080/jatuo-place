import { invokeConfirmDialog } from "@/components/common/alert-dialog";
import {
  TreeNode,
  TreeNodeAction,
  TreeNodeTitle,
  type TreeNodeActionProps,
} from "@/components/common/tree";
// React Hook Form 的 FormField 已弃用，改用 TanStack form.Field
import { useLocalizer, type ModCategory } from "@/libs/map-combo";
import { Group, SquarePen, Trash2 } from "lucide-react";
import { type ComponentProps, type MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { ModCreateButton, ModTreeNode } from "./mod";
import { Button } from "@/components/ui/button";
import { CategoryEditSheet } from "../edit-sheet/category";
import {
  useModsByCategory,
  useCreateCategory,
  useDeleteCategory,
} from "../atoms/hooks";

// 创建逻辑已迁移到 hooks

export function CategoryCreateButton(
  props: Omit<ComponentProps<typeof Button>, "type" | "onClick"> & {
    onCreated?: (category: ModCategory) => void;
  },
) {
  const { onCreated } = props;
  const createCategory = useCreateCategory();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newCategory = createCategory();
    onCreated?.(newCategory);
  };

  return (
    <Button
      size="sm"
      type="button"
      variant="outline"
      {...props}
      onClick={handleClick}
    >
      <Group />
      <span>{t(($) => $["category"]["create"])}</span>
    </Button>
  );
}

function CategoryEditButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID: string;
    index: number;
  },
) {
  "use no memo";
  const { categoryID, index, ...restProps } = props;
  const { t } = useTranslation("data-editor");

  return (
    <>
      <CategoryEditSheet index={index}>
        <TreeNodeAction tooltip={t(($) => $.category.edit)} {...restProps}>
          <SquarePen />
        </TreeNodeAction>
      </CategoryEditSheet>
    </>
  );
}

function CategoryDeleteButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID: string;
    categoryName?: string;
  },
) {
  const { categoryID, categoryName, ...restProps } = props;
  const deleteCategory = useDeleteCategory();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const title = t(($) => $.category["delete-confirm"].title);
    const content = t(($) => $.category["delete-confirm"].content, {
      categoryName,
      categoryID,
    });
    const confirmText = t(($) => $.category["delete-confirm"].confirm);
    const cancelText = t(($) => $.category["delete-confirm"].cancel);

    const confirmed = await invokeConfirmDialog({
      title,
      content,
      confirmText,
      cancelText,
    });
    if (!confirmed) {
      return;
    }
    deleteCategory(categoryID);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $.category.delete)}
      variant="destructive"
      {...restProps}
    >
      <Trash2 />
    </TreeNodeAction>
  );
}

export function CategoryTreeNode(props: {
  category: ModCategory;
  index: number;
}) {
  const { category, index } = props;
  const mods = useModsByCategory(category.id);
  const localize = useLocalizer();
  const { t } = useTranslation("data-editor");

  return (() => {
    return (
      <TreeNode
        className="sticky top-0 z-[2] bg-background"
        id={category.id}
        subNodes={mods.map((mod) => (
          <ModTreeNode key={mod.id} mod={mod} />
        ))}
      >
        <TreeNodeTitle>
          <Group className="size-4 text-muted-foreground" />
          <div className="truncate">{localize(category.name)}</div>
          <div className="shrink-0 text-xs text-muted-foreground">
            {t(($) => $.mod["count"], { count: mods.length })}
          </div>
        </TreeNodeTitle>

        <div className="contents" onClick={(e) => e.stopPropagation()}>
          <ModCreateButton categoryID={category.id} />
          <CategoryEditButton categoryID={category.id} index={index} />
          <CategoryDeleteButton
            categoryID={category.id}
            categoryName={localize(category.name)}
          />
        </div>
      </TreeNode>
    );
  })();
}
