import {
  useId,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Asterisk } from "lucide-react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

// UI-only SimpleFormField: external users control form bindings
export interface SimpleFormFieldProps {
  className?: string;
  /** The field's label. */
  label?: ReactNode;
  /** Whether the field is required. will show an asterisk */
  required?: boolean;
  /** The field's children element. */
  children: ReactElement;
  /** Optional orientation of the field. */
  orientation?: ComponentProps<typeof Field>["orientation"];
  /** Optional description to display below the field. */
  description?: ReactNode;
  /** Whether the field is invalid. */
  invalid?: boolean;
  /** Errors to display. only show when `invalid` is true */
  errors?: Array<{ message?: string } | string>;
  /** Whether to keep the error space even when there are no errors. */
  keepErrorSpace?: boolean;
}

export function SimpleFormField(props: SimpleFormFieldProps) {
  const {
    className,
    label,
    children,
    required,
    description,
    orientation,
    invalid: invalidProp,
    errors,
  } = props;
  const inputID = useId();
  const normalizedErrors = (errors ?? []).map((e) =>
    typeof e === "string" ? { message: e } : e,
  ) as Array<{ message?: string }>;
  const invalid = invalidProp ?? normalizedErrors.length > 0;
  return (
    <Field
      className={className}
      orientation={orientation}
      data-invalid={invalid}
    >
      {label && (
        <FieldLabel htmlFor={inputID}>
          <div className="flex items-center">
            <span>{label}</span>
            {required && (
              <Asterisk
                className={"size-3.5 -translate-y-0.5 text-destructive"}
              />
            )}
          </div>
        </FieldLabel>
      )}
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
