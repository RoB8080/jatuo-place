import {
  SimpleFormField,
  useAppForm,
  withForm,
} from "@/components/common/form";
import { FieldSet, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import ConditionEditor from "../condition-editor";
import type { Condition } from "@/libs/map-combo";
import type { LocaleMap } from "@/libs/map-combo/locale";
import { LocaleSetTextareaField } from "@/components/common/locale-field";

const ModIDField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModIDField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
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
              label={t(($) => $.entity.modPanel.idLabel)}
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
    const { t } = useTranslation("data-editor");
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
              label={t(($) => $.entity.modPanel.nameLabel)}
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
    const { t } = useTranslation("data-editor");
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
              label={t(($) => $.entity.modPanel.versionLabel)}
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

const ModDescriptionField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModDescriptionField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <LocaleSetTextareaField
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form={form as any}
        path="description"
        label={t(($) => $.entity.modPanel.descriptionLegend)}
        rows={4}
      />
    );
  },
});

const ModTipsField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModTipsField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`tips`}>
        {(field) => {
          const tips = (field.state.value ?? []) as Array<LocaleMap>;
          return (
            <div className="space-y-3">
              <FieldLegend>
                {t(($) => $.entity.modPanel.tipsLegend)}
              </FieldLegend>
              {tips.map((_, i) => (
                <div key={i} className="space-y-2 rounded border p-2">
                  <LocaleSetTextareaField
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    form={form as any}
                    path={`tips.${i}`}
                    label={t(($) => $.entity.modPanel.tipsLegend)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        field.setValue((curr) => {
                          const next = [...(curr ?? [])];
                          next.splice(i, 1);
                          return next;
                        })
                      }
                    >
                      {t(($) => $.entity.modPanel.tipsRemoveAction)}
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() =>
                    field.setValue((curr) => [...(curr ?? []), { en: "" }])
                  }
                >
                  {t(($) => $.entity.modPanel.tipsAddAction)}
                </Button>
              </div>
            </div>
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
    const { t } = useTranslation("data-editor");
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
              label={t(($) => $.entity.modPanel.categoryIDLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <ResponsiveCombobox
                contentClassName="data-[mobile=true]:min-h-[50svh]"
                options={categories.map((c) => {
                  const label = localize(c.name);
                  return {
                    value: c.id,
                    keywords: [c.id, label],
                    label,
                  };
                })}
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

const ModConditionField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModConditionField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`condition`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.conditionLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <ConditionEditor
                value={field.state.value as Condition | undefined}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(next) => field.setValue(() => next as any)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

const ModAuthorField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModAuthorField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`author`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.authorLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

const ModIsPaidField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModIsPaidField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`isPaid`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          const checked = Boolean(field.state.value);
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.isPaidLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Checkbox
                id="isPaid"
                checked={checked}
                onCheckedChange={(v) => field.setValue(() => Boolean(v))}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

const ModIsPassiveField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModIsPassiveField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`isPassive`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          const checked = Boolean(field.state.value);
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.isPassiveLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Checkbox
                id="isPassive"
                checked={checked}
                onCheckedChange={(v) => field.setValue(() => Boolean(v))}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

const ModPosterURLField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModPosterURLField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`posterURL`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.posterURLLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

const ModMainPageURLField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModMainPageURLField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`mainPageURL`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.mainPageURLLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

const ModDownloadURLField = withForm({
  defaultValues: {} as NonRecursiveMod,
  render: function ModDownloadURLField(props) {
    const { form } = props;
    const { t } = useTranslation("data-editor");
    return (
      <form.Field name={`downloadURL`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={t(($) => $.entity.modPanel.downloadURLLabel)}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
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
        <FieldSet className="min-h-0 flex-auto overflow-y-auto px-4">
          <ModIDField form={localForm} />
          <ModNameField form={localForm} />
          <ModVersionField form={localForm} />
          <ModAuthorField form={localForm} />
          <ModIsPaidField form={localForm} />
          <ModIsPassiveField form={localForm} />
          <ModPosterURLField form={localForm} />
          <ModMainPageURLField form={localForm} />
          <ModDownloadURLField form={localForm} />
          <ModDescriptionField form={localForm} />
          <ModTipsField form={localForm} />
          <ModCategoryIDField form={localForm} />
          <ModConditionField form={localForm} />
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
