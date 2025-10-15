import { useId, type ReactElement, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Asterisk } from "lucide-react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

// UI-only SimpleFormField: external users control form bindings
export interface SimpleFormFieldProps {
  /** The field's label. */
  label: ReactNode;
  /** Whether the field is required. will show an asterisk */
  required?: boolean;
  /** The field's children element. */
  children: ReactElement;
  /** Optional description to display below the field. */
  description?: ReactNode;
  /** Whether the field is invalid. */
  invalid?: boolean;
  /** Errors to display. only show when `invalid` is true */
  errors?: Array<{ message?: string } | string>;
}

export function SimpleFormField(props: SimpleFormFieldProps) {
  const {
    label,
    children,
    required,
    description,
    invalid: invalidProp,
    errors,
  } = props;
  const inputID = useId();
  const normalizedErrors = (errors ?? []).map((e) =>
    typeof e === "string" ? { message: e } : e,
  ) as Array<{ message?: string }>;
  const invalid = invalidProp ?? normalizedErrors.length > 0;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={inputID}>
        {label}
        {required && (
          <Asterisk className={"size-3.5 text-destructive"} {...props} />
        )}
      </FieldLabel>
      <Slot id={inputID} aria-invalid={invalid}>
        {children}
      </Slot>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && normalizedErrors.length > 0 && (
        <FieldError errors={normalizedErrors} />
      )}
    </Field>
  );
}

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext,
});

// eslint-disable-next-line react-refresh/only-export-components
export { useAppForm, withForm };
