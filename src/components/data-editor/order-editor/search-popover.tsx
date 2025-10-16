import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Search } from "lucide-react";
import type { ModFile, Mod } from "@/libs/map-combo";
import { cn } from "@/libs/utils";

export type SearchPopoverProps = {
  items: Array<{ id: string; file: ModFile }>;
  modsByID: Map<string, Mod>;
  onSelectItem: (id: string) => void;
  className?: string;
};

export function SearchPopover({
  items,
  modsByID,
  onSelectItem,
  className,
}: SearchPopoverProps) {
  const { t } = useTranslation("data-editor");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const matchedCount = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return 0;
    return items.filter(({ file }) => file.name.toLowerCase().includes(q))
      .length;
  }, [items, value]);

  const resultCountLabel = value
    ? t(($) => $.orderPanel.resultCount, { count: matchedCount })
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          aria-label={t(($) => $.orderPanel.searchPlaceholder)}
          className={className}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>{t(($) => $.combobox.search, { ns: "common" })}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[420px] p-0">
        <Command
          className={cn("w-full bg-transparent")}
          filter={(valueText, search, keywords) => {
            const extendValue = (
              valueText +
              " " +
              (keywords?.join(" ") ?? "")
            ).toLowerCase();
            const s = search.toLowerCase();
            if (!s) return 1;
            return extendValue.includes(s) ? 1 : 0;
          }}
        >
          <CommandInput
            value={value}
            onValueChange={setValue}
            placeholder={t(($) => $.orderPanel.searchPlaceholder)}
            autoFocus
          />
          {resultCountLabel && (
            <div className="px-3 py-1 text-xs text-muted-foreground">
              {resultCountLabel}
            </div>
          )}
          <CommandList>
            <CommandEmpty>
              {t(($) => $.combobox.empty, { ns: "common" })}
            </CommandEmpty>
            <CommandGroup>
              {items.map(({ id, file }) => {
                const mod = file.modID ? modsByID.get(file.modID) : undefined;
                return (
                  <CommandItem
                    key={id}
                    value={file.name}
                    keywords={[mod?.name ?? "", file.name]}
                    onSelect={() => {
                      onSelectItem(id);
                      setOpen(false);
                    }}
                  >
                    <span className="flex-1 break-words whitespace-normal">
                      {file.name}
                    </span>
                    <span
                      className="ml-2 max-w-32 shrink-0 truncate text-xs text-muted-foreground"
                      title={mod?.name ?? "—"}
                    >
                      {mod?.name ?? "—"}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
