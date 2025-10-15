import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "../ui/input-group";
import { useCategories } from "./atoms/hooks";
import { cn } from "@/libs/utils";
import { TreeRoot } from "../common/tree";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ModNomadListTreeNode } from "./tree/mod";
import { FileNomadListTreeNode } from "./tree/file";
import { CategoryCreateButton, CategoryTreeNode } from "./tree/category";

function SearchInput(props: {
  className?: string;
  value: string;
  resultCount: number;
  onChange: (value: string) => void;
}) {
  const { className, value, resultCount, onChange } = props;
  const { t } = useTranslation("data-editor");
  const resultCountText = value
    ? t(($) => $["mod-editor"]["result-count"], {
        count: resultCount,
      })
    : null;

  return (
    <InputGroup className={className}>
      <InputGroupInput
        placeholder={t(($) => $["mod-editor"]["search-placeholder"])}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {resultCountText && (
        <InputGroupAddon align="inline-end">{resultCountText}</InputGroupAddon>
      )}
    </InputGroup>
  );
}

export interface TreeEditorProps {
  className?: string;
}

export function TreeEditor(props: TreeEditorProps) {
  "use no memo";
  const { className } = props;
  const categories = useCategories();
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      data-slot="tree-editor"
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="flex shrink-0 items-center gap-2">
        <SearchInput
          value={searchValue}
          resultCount={1}
          onChange={setSearchValue}
        />
        <CategoryCreateButton />
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <TreeRoot size="sm" className="flex flex-col">
          <>
            {categories.map((category, idx) => (
              <CategoryTreeNode
                index={idx}
                key={category.id}
                category={category}
              />
            ))}
            <ModNomadListTreeNode />
            <FileNomadListTreeNode />
          </>
        </TreeRoot>
        <ScrollBar
          data-slot="tree-editor-content-scrollbar"
          orientation="vertical"
          size="sm"
        />
      </ScrollArea>
    </div>
  );
}
