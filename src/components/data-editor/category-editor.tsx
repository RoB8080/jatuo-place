import { useLocalizer, type MapComboData } from "@/libs/map-combo";
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
import { CircleAlert, Plus, SquarePen, X } from "lucide-react";
import { Button } from "../ui/button";
import { SimpleTooltip } from "../common";
import { Input } from "../ui/input";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { SimpleFormField } from "../common/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/libs/common";

function CategoryIDField(props: { index: number }) {
  const { index } = props;
  const { t } = useTranslation("data-editor");
  const { control } = useFormContext<MapComboData>();

  return (
    <SimpleFormField
      name={`categories.${index}.id`}
      control={control}
      label={t(($) => $["category-editor"]["category-id-label"])}
      description={t(($) => $["category-editor"]["category-id-description"])}
      required
    >
      <Input />
    </SimpleFormField>
  );
}

function useCategoryNameLabel(lang: "en" | "ru" | "zh") {
  const { t } = useTranslation("data-editor");

  switch (lang) {
    case "en":
      return t(($) => $["category-editor"]["category-name-en-label"]);
    case "ru":
      return t(($) => $["category-editor"]["category-name-ru-label"]);
    case "zh":
      return t(($) => $["category-editor"]["category-name-zh-label"]);
  }
}

function CategoryNameField(props: { index: number; lang: "en" | "ru" | "zh" }) {
  const { index, lang } = props;
  const { control } = useFormContext<MapComboData>();
  const label = useCategoryNameLabel(lang);

  return (
    <SimpleFormField
      name={`categories.${index}.name.${lang}`}
      control={control}
      label={label}
      required={lang === "en"}
    >
      <Input />
    </SimpleFormField>
  );
}

function CategoryEditSheet(props: { index: number }) {
  const { index } = props;
  const { t } = useTranslation("data-editor");
  const isMobile = useIsMobile();

  // t("category-editor.edit-category", { ns: "data-editor" })
  const title = t(($) => $["category-editor"]["edit-category"]);

  return (
    <SheetContent side={isMobile ? "bottom" : "right"}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      <div className="flex flex-col gap-2 px-4">
        <CategoryIDField index={index} />
        <CategoryNameField index={index} lang="en" />
        <CategoryNameField index={index} lang="ru" />
        <CategoryNameField index={index} lang="zh" />
      </div>
    </SheetContent>
  );
}

function CategoryCard(props: { index: number }) {
  const { index } = props;
  const localize = useLocalizer();
  const { control, setValue, getValues } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");
  const modCount = useWatch({
    control,
    compute: (data) => {
      const categoryID = data.categories[index].id;
      return data.mods.filter((mod) => mod.categoryID === categoryID).length;
    },
  });

  return (
    <Sheet>
      <FormField
        control={control}
        name={`categories.${index}`}
        render={({ field, fieldState }) => (
          <FormItem className="contents">
            <Card
              size="sm"
              data-invalid={Boolean(fieldState.error)}
              className="data-[invalid=true]:border-destructive/70 dark:data-[invalid=true]:border-destructive/60"
            >
              <CardHeader>
                <CardTitle>
                  {localize(field.value.name)}
                  {Boolean(fieldState.error) && (
                    <CircleAlert className="ml-1 inline-block size-4 align-[-1.5px] text-destructive/70 dark:text-destructive/60" />
                  )}
                </CardTitle>
                <CardDescription>
                  ID: {field.value.id}，共 {modCount}{" "}
                  {t(($) => $["category-editor"].mods)}
                </CardDescription>
                <FormMessage />
                <CardAction className="flex flex-row items-center self-center">
                  <SheetTrigger>
                    <Button type="button" size="icon-sm" variant="ghost">
                      <SquarePen />
                    </Button>
                  </SheetTrigger>
                  {modCount > 0 ? (
                    <SimpleTooltip
                      content={t(($) => $["category-editor"]["delete-tip-1"])}
                    >
                      <Button
                        type="button"
                        className="disabled:pointer-events-auto"
                        size="icon-sm"
                        variant="ghost-destructive"
                        disabled
                      >
                        <X />
                      </Button>
                    </SimpleTooltip>
                  ) : (
                    <Button
                      size="icon-sm"
                      variant="ghost-destructive"
                      type="button"
                      onClick={() =>
                        setValue(
                          "categories",
                          getValues("categories").filter(
                            (_, idx) => idx !== index,
                          ),
                        )
                      }
                    >
                      <X />
                    </Button>
                  )}
                </CardAction>
              </CardHeader>
            </Card>
          </FormItem>
        )}
      />
      <CategoryEditSheet index={index} />
    </Sheet>
  );
}

export interface CategoryEditorProps {
  className?: string;
}

export function CategoryEditor(props: CategoryEditorProps) {
  const { className } = props;
  const { control, setValue, getValues } = useFormContext<MapComboData>();
  const { t } = useTranslation("data-editor");

  return (
    <ScrollArea data-slot="category-editor" className={className}>
      <div className="grid grid-cols-2 gap-3 py-2">
        <FormField
          control={control}
          name="categories"
          render={({ field }) => (
            <>
              {field.value.map((_, index) => (
                <CategoryCard key={index} index={index} />
              ))}
            </>
          )}
        />
        <Card
          className="h-[74px] cursor-pointer select-none "
          size="sm"
          variant="dashed"
          onClick={() =>
            setValue("categories", [
              ...getValues("categories"),
              { id: "new_category", name: { en: "New Category" } },
            ])
          }
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
