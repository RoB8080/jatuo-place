import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { useTranslation } from "react-i18next";
import { useMapComboContext } from "./context";
import { cn } from "@/libs/utils";
import { LibraryBig } from "lucide-react";

export interface VersionSelectProps {
  id?: string;
  className?: string;
  contentClassName?: string;
}

export function VersionSelect({
  id,
  className,
  contentClassName,
}: VersionSelectProps) {
  const { availableVersionKeys, setSelectedVersionKey, selectedVersionKey } =
    useMapComboContext();
  const { t } = useTranslation("map-combo");
  return (
    <Select value={selectedVersionKey} onValueChange={setSelectedVersionKey}>
      <SelectTrigger
        id={id}
        className={cn("w-[170px] cursor-pointer select-none", className)}
      >
        <div className="flex flex-row items-center gap-2">
          <LibraryBig className="size-4 text-muted-foreground" />
          <SelectValue
            placeholder={t(($) => $["version-select"].placeholder)}
          />
        </div>
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {availableVersionKeys.map((version) => (
          <SelectItem key={version} value={version}>
            {version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
