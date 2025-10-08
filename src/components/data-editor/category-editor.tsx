import {
  modCategorySchema,
  useLocalizer,
  type MapComboData,
  type ModCategory,
} from "@/libs/map-combo";
import { useForm, useFormContext, useWatch } from "react-hook-form";
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
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { useId } from "react";

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

const CategoryEditDialog = defineAlertDialogTemplate<
  ModCategory,
  { init?: ModCategory }
>(function CategoryEditDialog(props) {
  const { cancel, init } = props;
  const { t } = useTranslation("data-editor");
  const form = useForm<ModCategory>({
    resolver: standardSchemaResolver(modCategorySchema),
    defaultValues: init || { id: "", name: { en: "" } },
  });
  const formID = useId();

  const title = t(
    ($) =>
      init?.id
        ? $["category-editor"]["edit-category"] // t("category-editor.edit-category", { ns: "data-editor" })
        : $["category-editor"]["new-category"], // t("category-editor.new-category", { ns: "data-editor" })
  );

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
      </AlertDialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit((t) => {
            console.debug("valid", t);
          })}
        >
          <FormField
            name="id"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {/* t("category-editor.category-id-label", { ns: "data-editor" }) */}
                  {t(($) => $["category-editor"]["category-id-label"])}
                </FormLabel>
                <Input {...field} />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name.en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {/* t("category-editor.category-name-en-label", { ns: "data-editor" }) */}
                    {t(($) => $["category-editor"]["category-name-en-label"])}
                  </FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name.ru"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {/* t("category-editor.category-name-ru-label", { ns: "data-editor" }) */}
                    {t(($) => $["category-editor"]["category-name-ru-label"])}
                  </FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name.zh"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {/* t("category-editor.category-name-zh-label", { ns: "data-editor" }) */}
                    {t(($) => $["category-editor"]["category-name-zh-label"])}
                  </FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <AlertDialogFooter>
        <Button variant="ghost" onClick={() => cancel()}>
          {/* t("category-editor.cancel-create-category", { ns: "data-editor" }) */}
          {t(($) => $["category-editor"]["cancel-create-category"])}
        </Button>
        <Button
          onClick={() => console.debug("confirm", form.getValues())}
          type="submit"
          form={formID}
        >
          {/* t("category-editor.confirm-create-category", { ns: "data-editor" }) */}
          {t(($) => $["category-editor"]["confirm-create-category"])}
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
              component: CategoryEditDialog,
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
