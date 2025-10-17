import { SimpleFormField, withForm } from "@/components/common/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ReactNode } from "react";
import { Field, FieldLabel } from "@/components/ui/field";

export type AppLang = "en" | "ru" | "zh";

const LocaleTextField = withForm({
  // 使用 any 以便跨不同表单实体复用，避免类型不兼容
  // 具体实体的类型由传入的 form 实例决定
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: {} as any,
  props: {
    path: "",
    lang: "en",
    label: "",
    required: false,
  } as {
    path: string;
    lang: AppLang;
    label: ReactNode;
    required?: boolean;
  },
  render: function LocaleTextField(props) {
    const { form, path, lang, label, required } = props;

    return (
      <form.Field name={`${path}.${lang}`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;

          return (
            <SimpleFormField
              className="justify-between"
              orientation="horizontal"
              label={label}
              required={required ?? lang === "en"}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Input
                className="max-w-60 flex-auto"
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

export const LocaleTextareaField = withForm({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: {} as any,
  props: {
    path: "" as string,
    lang: "en" as AppLang,
    label: "" as ReactNode,
    required: false as boolean,
    rows: 4 as number,
  },
  render: function LocaleTextareaField(props) {
    const { form, path, lang, label, required, rows } = props;

    return (
      <form.Field name={`${path}.${lang}`}>
        {(field) => {
          const errors = field.state?.meta?.errors ?? [];
          const normalizedErrors = errors.map((e) =>
            typeof e === "string" ? { message: e } : e,
          ) as Array<{ message?: string }>;
          const invalid = normalizedErrors.length > 0;

          return (
            <SimpleFormField
              className="justify-between"
              label={label}
              required={required ?? lang === "en"}
              invalid={invalid}
              errors={normalizedErrors}
            >
              <Textarea
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                rows={rows}
              />
            </SimpleFormField>
          );
        }}
      </form.Field>
    );
  },
});

export const LocaleSetTextField = withForm({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: {} as any,
  props: {
    path: "" as string,
    label: "" as ReactNode,
  },
  render: function LocaleSetTextField(props) {
    const { form, path, label } = props;
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <LocaleTextField
          form={form}
          path={path}
          lang="en"
          label="EN"
          required
        />
        <LocaleTextField form={form} path={path} lang="ru" label="RU" />
        <LocaleTextField form={form} path={path} lang="zh" label="ZH" />
      </Field>
    );
  },
});

export const LocaleSetTextareaField = withForm({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues: {} as any,
  props: {
    path: "" as string,
    label: "" as ReactNode,
    rows: 4 as number,
  },
  render: function LocaleSetTextareaField(props) {
    const { form, path, label, rows } = props;
    return (
      <Field>
        <FieldLabel>{label}</FieldLabel>
        <LocaleTextareaField
          form={form}
          path={path}
          lang="en"
          label="EN"
          required
          rows={rows}
        />
        <LocaleTextareaField
          form={form}
          path={path}
          lang="ru"
          label="RU"
          rows={rows}
          required={false}
        />
        <LocaleTextareaField
          form={form}
          path={path}
          lang="zh"
          label="ZH"
          rows={rows}
          required={false}
        />
      </Field>
    );
  },
});
