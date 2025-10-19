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
import { LocaleSetTextField } from "@/components/common/locale-field";

function useCategoryEditPanelLocales() {
  const { t } = useTranslation("data-editor");
  return {
    idLabel: t(($) => $.category.property.id),
    idDesc: t(($) => $.category.propertyDesc.id),
    nameLabel: t(($) => $.category.property.name),
  };
}

const CategoryIDField = withForm({
  defaultValues: {} as ModCategory,
  render: function CategoryIDField(props) {
    const { form } = props;
    const panelLocales = useCategoryEditPanelLocales();

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
              label={panelLocales.idLabel}
              description={panelLocales.idDesc}
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
  const panelLocales = useCategoryEditPanelLocales();

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
        <FieldSet className="min-h-0 flex-auto overflow-y-auto px-4">
          <CategoryIDField form={localForm} />
          <LocaleSetTextField
            form={localForm}
            path="name"
            label={panelLocales.nameLabel}
          />
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
