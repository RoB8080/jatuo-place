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
  DrawerHeader,
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
import { Slot } from "@radix-ui/react-slot";

export type ComboboxOption = {
  value: string;
  label: string;
  keywords?: string[];
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

  const commandList = (
    <CommandList>
      <CommandEmpty>{emptyLabel ?? t(($) => $.combobox.empty)}</CommandEmpty>
      <CommandGroup>
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <CommandItem
              key={opt.value}
              value={opt.value}
              keywords={opt.keywords}
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
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent data-mobile="true" className={contentClassName}>
          <Command
            filter={(value, search, keywords) => {
              const extendValue = value + " " + keywords?.join(" ");
              if (extendValue.includes(search)) return 1;
              return 0;
            }}
            className={cn("w-full bg-transparent")}
          >
            <DrawerHeader className="flex flex-row items-center gap-2">
              <CommandInput
                wrapperClassName="flex-auto rounded-lg border"
                placeholder={searchPlaceholder ?? t(($) => $.combobox.search)}
              />
              <DrawerClose>
                <Button variant="ghost" className="px-2">
                  {t(($) => $.combobox.close)}
                </Button>
              </DrawerClose>
            </DrawerHeader>
            <Slot className="mx-3">{commandList}</Slot>
          </Command>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        data-mobile="false"
        className={contentClassName}
        align="start"
      >
        <Command
          className={cn("w-full bg-transparent")}
          filter={(value, search, keywords) => {
            const extendValue = value + " " + keywords?.join(" ");
            if (extendValue.includes(search)) return 1;
            return 0;
          }}
        >
          <CommandInput
            placeholder={searchPlaceholder ?? t(($) => $.combobox.search)}
          />
          {commandList}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
