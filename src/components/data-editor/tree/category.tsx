import { invokeConfirmDialog } from "@/components/common/alert-dialog";
import {
  TreeNode,
  TreeNodeAction,
  TreeNodeTitle,
  type TreeNodeActionProps,
} from "@/components/common/tree";
import { FormField } from "@/components/ui/form";
import {
  useLocalizer,
  type MapComboData,
  type ModCategory,
} from "@/libs/map-combo";
import { Group, SquarePen, Trash2 } from "lucide-react";
import type { ComponentProps, MouseEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ModCreateButton, ModTreeNode } from "./mod";
import { Button } from "@/components/ui/button";

/** create a new category */
function createNewCategory(categories: ModCategory[]): ModCategory {
  let maxNewCategoryIDNumber = 0;
  categories.forEach((category) => {
    const categoryIDTextualNumber = category.id.match(/^new_category_(\d+)$/);
    if (categoryIDTextualNumber) {
      const categoryIDNumber = parseInt(categoryIDTextualNumber[1]);
      if (categoryIDNumber > maxNewCategoryIDNumber) {
        maxNewCategoryIDNumber = categoryIDNumber;
      }
    }
  });

  const newCategoryIDNumber = maxNewCategoryIDNumber + 1;
  const newCategoryID = `new_category_${newCategoryIDNumber}`;
  const newCategory: ModCategory = {
    id: newCategoryID,
    name: { en: `New Category ${newCategoryIDNumber}` },
  };

  return newCategory;
}

export function CategoryCreateButton(
  props: Omit<ComponentProps<typeof Button>, "type" | "onClick"> & {
    onCreated?: (category: ModCategory) => void;
  },
) {
  const { onCreated } = props;
  const { getValues, setValue } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const categories = getValues("categories");
    const newCategory = createNewCategory(categories);
    setValue("categories", [...categories, newCategory]);
    onCreated?.(newCategory);
  };

  return (
    <Button type="button" variant="outline" {...props} onClick={handleClick}>
      <Group />
      <span>{t(($) => $["category"]["create"])}</span>
    </Button>
  );
}

function CategoryEditButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID?: string;
  },
) {
  const { categoryID, ...restProps } = props;
  const { t } = useTranslation("data-editor");

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.debug("Edit category:", categoryID);
  };

  return (
    <TreeNodeAction
      onClick={handleClick}
      tooltip={t(($) => $.category.edit)}
      {...restProps}
    >
      <SquarePen />
    </TreeNodeAction>
  );
}

function CategoryDeleteButton(
  props: Omit<TreeNodeActionProps, "onClick" | "tooltip" | "destructive"> & {
    categoryID?: string;
    categoryName?: string;
  },
) {
  const { categoryID, categoryName, ...restProps } = props;
  const { getValues, setValue } = useFormContext<MapComboData>();
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

    // Remove category
    const categories = getValues("categories");
    const newCategories = categories.filter(
      (category) => category.id !== categoryID,
    );
    setValue("categories", newCategories);

    // Unassign mods
    const mods = getValues("mods");
    const newMods = mods.map((mod) =>
      mod.categoryID === categoryID ? { ...mod, categoryID: "" } : mod,
    );
    setValue("mods", newMods);
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

export function CategoryTreeNode(props: { category: ModCategory }) {
  const { category } = props;
  const { control } = useFormContext<MapComboData>();
  const localize = useLocalizer();
  const { t } = useTranslation("data-editor");

  return (
    <FormField
      control={control}
      name="mods"
      render={({ field }) => {
        const mods = field.value.filter(
          (mod) => mod.categoryID === category.id,
        );

        return (
          <TreeNode
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

            <ModCreateButton categoryID={category.id} />
            <CategoryEditButton categoryID={category.id} />
            <CategoryDeleteButton
              categoryID={category.id}
              categoryName={localize(category.name)}
            />
          </TreeNode>
        );
      }}
    />
  );
}
