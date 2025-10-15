import {
  SimpleFormField,
  useAppForm,
  withForm,
} from "@/components/common/form";
import { FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/libs/common";
import { useState, type ReactNode } from "react";
import { useCategories, useUpdateCategory } from "../atoms/hooks";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { modCategorySchema, type ModCategory } from "@/libs/map-combo";
import { SimpleEmpty } from "@/components/common/empty";

function useCategoryIDLabels() {
  const { t } = useTranslation("data-editor");
  const fieldLabel = t(($) => $.entity.categoryPanel.idLabel);
  const fieldDescription = t(($) => $.entity.categoryPanel.idDescription);
  return {
    fieldLabel,
    fieldDescription,
  };
}

const CategoryIDField = withForm({
  defaultValues: {} as ModCategory,
  render: function CategoryIDField(props) {
    const { form } = props;
    const { fieldLabel, fieldDescription } = useCategoryIDLabels();

    return (
      <form.Field name={`id`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={fieldLabel}
              description={fieldDescription}
              required
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

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

const CategoryNameField = withForm({
  defaultValues: {} as ModCategory,
  props: {
    lang: "en" as "en" | "ru" | "zh",
  },
  render: function CategoryNameField(props) {
    const { form, lang } = props;
    const label = useCategoryNameLabel(lang);

    return (
      <form.Field name={`name.${lang}`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={label}
              required={lang === "en"}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

function useCategoryEditSheetLocales() {
  const { t } = useTranslation("data-editor");
  return {
    title: t(($) => $.entity.categoryPanel.title),
    notFound: t(($) => $.entity.categoryPanel.notFound),
    save: t(($) => $.entity.editPanel.save),
    cancel: t(($) => $.entity.editPanel.cancel),
  };
}

export function CategoryEditSheet(props: {
  index: number;
  children: ReactNode;
}) {
  const { index, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const locales = useCategoryEditSheetLocales();

  const isMobile = useIsMobile();
  const categories = useCategories();
  const updateCategory = useUpdateCategory();

  const category = categories[index];
  const localForm = useAppForm({
    defaultValues: category,
    validators: {
      onChange: modCategorySchema,
    },
    onSubmit: ({ value }) => {
      updateCategory(index, value);
    },
  });

  if (!category) {
    return <SimpleEmpty title={locales.notFound} />;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </SheetTrigger>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <SheetHeader>
          <SheetTitle>{locales.title}</SheetTitle>
        </SheetHeader>
        <FieldSet className="px-4">
          <CategoryIDField form={localForm} />
          <CategoryNameField form={localForm} lang="en" />
          <CategoryNameField form={localForm} lang="ru" />
          <CategoryNameField form={localForm} lang="zh" />
        </FieldSet>
        <SheetFooter className="flex-row">
          <Button className="flex-1" variant="outline">
            {locales.cancel}
          </Button>
          <Button
            className="flex-2"
            type="button"
            onClick={() => {
              localForm.handleSubmit().then(() => setIsOpen(false));
            }}
          >
            {locales.save}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
