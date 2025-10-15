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
import { useCategories, useMods, useUpdateMod } from "../atoms/hooks";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  modSchema,
  type Mod,
  type NonRecursiveMod,
  useLocalizer,
} from "@/libs/map-combo";
import { SimpleEmpty } from "@/components/common/empty";
import type { StandardSchemaV1 } from "@tanstack/react-form";
import { ResponsiveCombobox } from "@/components/common/combobox";

const ModIDField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModIDField(props) {
    const { form } = props;
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
              label={"Mod ID"}
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

const ModNameField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModNameField(props) {
    const { form } = props;
    return (
      <form.Field name={`name`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={"Mod Name"}
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

const ModVersionField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModVersionField(props) {
    const { form } = props;
    return (
      <form.Field name={`version`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={"Version"}
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

const ModCategoryIDField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModCategoryIDField(props) {
    const { form } = props;
    const categories = useCategories();
    const localize = useLocalizer();
    return (
      <form.Field name={`categoryID`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={"Category ID"}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <ResponsiveCombobox
                options={categories.map((c) => ({
                  value: c.id,
                  label: localize(c.name),
                }))}
                value={field.state.value}
                onChange={(v: string) => field.setValue(() => v)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

function useModEditSheetLocales() {
  const { t } = useTranslation("data-editor");
  return {
    title: t(($) => $.entity.modPanel.title),
    notFound: t(($) => $.entity.modPanel.notFound),
    save: t(($) => $.entity.editPanel.save),
    cancel: t(($) => $.entity.editPanel.cancel),
  };
}

export function ModEditSheet(props: { modID: string; children: ReactNode }) {
  const { modID, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const locales = useModEditSheetLocales();
  const isMobile = useIsMobile();
  const mods = useMods();
  const updateMod = useUpdateMod();

  const mod = mods.find((m) => m.id === modID);

  const localForm = useAppForm({
    defaultValues: mod as NonRecursiveMod,
    validators: {
      onChange: modSchema as StandardSchemaV1<NonRecursiveMod>,
    },
    onSubmit: ({ value }: { value: NonRecursiveMod }) => {
      updateMod(modID, value as Mod);
    },
  });

  if (!mod) {
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
          <ModIDField form={localForm} />
          <ModNameField form={localForm} />
          <ModVersionField form={localForm} />
          <ModCategoryIDField form={localForm} />
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
