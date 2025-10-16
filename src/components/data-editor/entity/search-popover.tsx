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
  CommandSeparator,
} from "../../ui/command";
import { File, Package, Search } from "lucide-react";
import type { ModCategory, Mod, ModFile } from "@/libs/map-combo";
import { cn } from "@/libs/utils";

export type EntityPick =
  | { kind: "mod"; modID: string; categoryID?: string }
  | { kind: "file"; fileName: string; modID?: string; categoryID?: string };

export type EntitySearchPopoverProps = {
  mods: Mod[];
  files: ModFile[];
  categoriesByID?: Map<string, ModCategory>;
  onPick: (pick: EntityPick) => void;
  className?: string;
};

export function EntitySearchPopover({
  mods,
  files,
  categoriesByID,
  onPick,
  className,
}: EntitySearchPopoverProps) {
  const { t } = useTranslation("data-editor");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const modsByID = useMemo(() => new Map(mods.map((m) => [m.id, m])), [mods]);

  const matchedCount = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return 0;
    const modMatches = mods.filter((m) => m.name.toLowerCase().includes(q));
    const fileMatches = files.filter((f) => f.name.toLowerCase().includes(q));
    return modMatches.length + fileMatches.length;
  }, [mods, files, value]);

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
          aria-label={t(($) => $.entityPanel.searchPlaceholder)}
          className={className}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>{t(($) => $.combobox.search, { ns: "common" })}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[480px] p-0">
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
            placeholder={t(($) => $.entityPanel.searchPlaceholder)}
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
              {mods.map((mod) => {
                const categoryName = categoriesByID
                  ? categoriesByID.get(mod.categoryID || "")?.name?.zh ||
                    categoriesByID.get(mod.categoryID || "")?.name?.en ||
                    undefined
                  : undefined;
                return (
                  <CommandItem
                    key={`mod:${mod.id}`}
                    value={`mod:${mod.id}`}
                    keywords={[mod.name, mod.id, categoryName ?? ""]}
                    onSelect={() => {
                      onPick({
                        kind: "mod",
                        modID: mod.id,
                        categoryID: mod.categoryID,
                      });
                      setOpen(false);
                    }}
                  >
                    <Package className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 break-words whitespace-normal">
                      {mod.name}
                    </span>
                    <span
                      className="ml-2 max-w-32 shrink-0 truncate text-xs text-muted-foreground"
                      title={categoryName ?? "—"}
                    >
                      {categoryName ?? "—"}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              {files.map((file) => {
                const mod = file.modID ? modsByID.get(file.modID) : undefined;
                return (
                  <CommandItem
                    key={`file:${file.modID ?? "nomad"}:${file.name}`}
                    value={`file:${file.modID ?? "nomad"}:${file.name}`}
                    keywords={[file.name, mod?.name ?? "", file.modID ?? ""]}
                    onSelect={() => {
                      onPick({
                        kind: "file",
                        fileName: file.name,
                        modID: file.modID,
                        categoryID: mod?.categoryID,
                      });
                      setOpen(false);
                    }}
                  >
                    <File className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
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
