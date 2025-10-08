import {
  useLocalizer,
  type MapComboData,
  type ModCategory,
} from "@/libs/map-combo";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useTranslation } from "react-i18next";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { SimpleTooltip } from "../common";
import { Input } from "../ui/input";
import {
  defineAlertDialogTemplate,
  invokeAlertDialog,
} from "../common/alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";

function CategoryCard(props: { category: ModCategory }) {
  const { category } = props;
  const localize = useLocalizer();
  const { control } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");
  const mods = useWatch({
    control,
    compute: (data) =>
      data.mods.filter((mod) => mod.categoryID === category.id),
  });

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{localize(category.name)}</CardTitle>
        <CardDescription>
          ID: {category.id}，共 {mods.length}{" "}
          {t(($) => $["category-editor"].mods)}
        </CardDescription>
        <CardAction className="self-center">
          {mods.length > 0 ? (
            <SimpleTooltip
              content={t(($) => $["category-editor"]["delete-tip-1"])}
            >
              <Button
                className="disabled:pointer-events-auto"
                size="icon-sm"
                variant="ghost-destructive"
                disabled
              >
                <X />
              </Button>
            </SimpleTooltip>
          ) : (
            <Button size="icon-sm" variant="ghost-destructive">
              <X />
            </Button>
          )}
        </CardAction>
      </CardHeader>
    </Card>
  );
}

const CategoryCreateDialog = defineAlertDialogTemplate<
  ModCategory,
  { init?: ModCategory }
>(function CategoryCreateDialog(props) {
  const { cancel, init } = props;
  const { t } = useTranslation("data-editor");
  const [category, setCategory] = useState<ModCategory>(
    () => init || { id: "", name: { en: "" } },
  );
  const title = t(($) => $["category-editor"]["new-category"]);
  // t("category-editor.confirm-create-category", { ns: "data-editor" })
  const confirmText = t(($) => $["category-editor"]["confirm-create-category"]);
  // t("category-editor.cancel-create-category", { ns: "data-editor" })
  const cancelText = t(($) => $["category-editor"]["cancel-create-category"]);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
      </AlertDialogHeader>
      <FieldGroup>
        <Field>
          <FieldLabel>
            {/* t("category-editor.category-id-label", { ns: "data-editor" }) */}
            {t(($) => $["category-editor"]["category-id-label"])}
          </FieldLabel>
          <Input
            value={category?.id || ""}
            onChange={(e) => setCategory({ ...category, id: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel>
              {/* t("category-editor.category-name-en-label", { ns: "data-editor" }) */}
              {t(($) => $["category-editor"]["category-name-en-label"])}
            </FieldLabel>
            <Input
              value={category?.name.en || ""}
              onChange={(e) =>
                setCategory({
                  ...category,
                  name: { ...category.name, en: e.target.value },
                })
              }
            />
          </Field>
          <Field>
            <FieldLabel>
              {/* t("category-editor.category-name-ru-label", { ns: "data-editor" }) */}
              {t(($) => $["category-editor"]["category-name-ru-label"])}
            </FieldLabel>
            <Input
              value={category?.name.ru || ""}
              onChange={(e) =>
                setCategory({
                  ...category,
                  name: { ...category.name, ru: e.target.value },
                })
              }
            />
          </Field>
          <Field>
            <FieldLabel>
              {/* t("category-editor.category-name-zh-label", { ns: "data-editor" }) */}
              {t(($) => $["category-editor"]["category-name-zh-label"])}
            </FieldLabel>
            <Input
              value={category?.name.zh || ""}
              onChange={(e) =>
                setCategory({
                  ...category,
                  name: { ...category.name, zh: e.target.value },
                })
              }
            />
          </Field>
        </div>
      </FieldGroup>
      <AlertDialogFooter>
        <Button variant="ghost" onClick={() => cancel()}>
          {cancelText}
        </Button>
        <Button onClick={() => console.debug("confirm", category)}>
          {confirmText}
        </Button>
      </AlertDialogFooter>
    </>
  );
});

export interface CategoryEditorProps {
  className?: string;
}

export function CategoryEditor(props: CategoryEditorProps) {
  const { className } = props;
  const { control } = useFormContext<MapComboData>();
  const categories = useWatch({
    control,
    name: "categories",
  });
  const { t } = useTranslation("data-editor");

  return (
    <ScrollArea data-slot="category-editor" className={className}>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
        <Card
          className="h-[74px] cursor-pointer select-none "
          size="sm"
          variant="dashed"
          onClick={async () => {
            const category = await invokeAlertDialog({
              component: CategoryCreateDialog,
            });
            console.debug("category", category);
          }}
        >
          <div className="flex flex-auto items-center justify-center gap-2 font-medium text-muted-foreground">
            <Plus className="size-5" />
            {t(($) => $["category-editor"]["new-category"])}
          </div>
        </Card>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
