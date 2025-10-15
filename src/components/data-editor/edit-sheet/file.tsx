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
import { useFiles, useMods, useUpdateFile } from "../atoms/hooks";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  modFileSchema,
  type ModFile,
  type NonRecursiveModFile,
} from "@/libs/map-combo";
import type { StandardSchemaV1 } from "@tanstack/react-form";
import { SimpleEmpty } from "@/components/common/empty";
import { ResponsiveCombobox } from "@/components/common/combobox";

const FileNameField = withForm({
  defaultValues: {} as NonRecursiveModFile,
  render: function FileNameField(props) {
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
              label={"File Name"}
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

const FileModIDField = withForm({
  defaultValues: {} as NonRecursiveModFile,
  render: function FileModIDField(props) {
    const { form } = props;
    const mods = useMods();
    return (
      <form.Field name={`modID`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;
          return (
            <SimpleFormField
              label={"Mod ID"}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <ResponsiveCombobox
                options={mods.map((m) => ({ value: m.id, label: m.name }))}
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

function useFileEditSheetLocales() {
  const { t } = useTranslation("data-editor");
  return {
    title: t(($) => $.entity.filePanel.title),
    notFound: t(($) => $.entity.filePanel.notFound),
    save: t(($) => $.entity.editPanel.save),
    cancel: t(($) => $.entity.editPanel.cancel),
  };
}

export function FileEditSheet(props: {
  fileName: string;
  children: ReactNode;
}) {
  const { fileName, children } = props;
  const [isOpen, setIsOpen] = useState(false);
  const locales = useFileEditSheetLocales();

  const isMobile = useIsMobile();
  const files = useFiles();
  const updateFile = useUpdateFile();

  const file = files.find((f) => f.name === fileName);

  const localForm = useAppForm({
    defaultValues: file as NonRecursiveModFile,
    validators: {
      onChange: modFileSchema as StandardSchemaV1<NonRecursiveModFile>,
    },
    onSubmit: ({ value }: { value: NonRecursiveModFile }) => {
      updateFile(fileName, value as ModFile);
    },
  });

  if (!file) {
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
          <FileNameField form={localForm} />
          <FileModIDField form={localForm} />
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
