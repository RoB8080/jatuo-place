import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/libs/utils";
import { useIsMobile } from "@/libs/common";
import { useTranslation } from "react-i18next";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type ComboboxProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "asChild" | "onChange" | "variant"
> & {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  title?: string;
  contentClassName?: string;
};

export function ResponsiveCombobox(props: ComboboxProps) {
  const {
    options,
    value: controlledValue,
    onChange,
    placeholder,
    searchPlaceholder,
    emptyLabel,
    title,
    contentClassName,
    ...buttonProps
  } = props;

  const isMobile = useIsMobile();
  const { t } = useTranslation("common");
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string>("");

  const selectedValue = controlledValue ?? uncontrolledValue;

  const selectedLabel = React.useMemo(() => {
    return options.find((o) => o.value === selectedValue)?.label ?? "";
  }, [options, selectedValue]);

  // Filtering is handled by Command internally via CommandInput

  const handleSelect = React.useCallback(
    (next: string) => {
      const value = next === selectedValue ? "" : next;
      if (onChange) {
        onChange(value);
      } else {
        setUncontrolledValue(value);
      }
      setOpen(false);
    },
    [onChange, selectedValue],
  );

  const triggerLabel =
    selectedLabel || (placeholder ?? t(($) => $.combobox.select));

  const triggerButton = (
    <Button
      role="combobox"
      aria-expanded={open}
      className={cn("w-[200px] justify-between", buttonProps.className)}
      {...buttonProps}
      variant="outline"
    >
      {triggerLabel}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const listContent = (
    <Command className={cn("w-full", contentClassName)}>
      <CommandInput
        placeholder={searchPlaceholder ?? t(($) => $.combobox.search)}
      />
      <CommandList>
        <CommandEmpty>{emptyLabel ?? t(($) => $.combobox.empty)}</CommandEmpty>
        <CommandGroup>
          {options.map((opt) => {
            const isSelected = selectedValue === opt.value;
            return (
              <CommandItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                onSelect={(val) => handleSelect(val)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    isSelected ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="truncate">{opt.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">{listContent}</div>
          <DrawerClose>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        {listContent}
      </PopoverContent>
    </Popover>
  );
}
