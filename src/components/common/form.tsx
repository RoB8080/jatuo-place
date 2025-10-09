import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRequiredIndicator,
} from "../ui/form";
import type { ReactElement, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";

export interface SimpleFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<ControllerProps<TFieldValues, TName>, "control" | "name"> {
  label: ReactNode;
  required?: boolean;
  children: ReactElement;
  description?: ReactNode;
}

export function SimpleFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: SimpleFormFieldProps<TFieldValues, TName>) {
  const { control, name, label, children, required, description } = props;
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <FormRequiredIndicator />}
            {description && <FormDescription>{description}</FormDescription>}
          </FormLabel>
          <FormControl>
            <Slot {...field}>{children}</Slot>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
