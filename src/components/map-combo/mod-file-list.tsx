import { useRef, type Ref } from "react";
import { Card, CardContent } from "../ui/card";
import { useMapComboContext, type ActivatedModFile } from "./context";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/libs/utils";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { SimpleTooltip } from "../common";

export interface ModFileListProps {
  className?: string;
}

function ModFile({
  data,
  ref,
}: {
  data: ActivatedModFile;
  ref: Ref<HTMLDivElement>;
}) {
  const { name, posterURL, mod } = data;
  const { downloadURL } = mod ?? {};
  const { t } = useTranslation("map-combo");
  const downloadLabel = t(($) => $["mod-file-list"].download);

  return (
    <Card size="sm" ref={ref}>
      <CardContent className="flex gap-3">
        {posterURL && (
          <img
            src={posterURL}
            alt={name}
            className="h-22 w-auto flex-none rounded-md"
          />
        )}
        <div className="flex flex-auto flex-col">
          <h4>{name}</h4>
          <p className="flex-auto text-wrap text-muted-foreground"></p>
          <div className="flex flex-row-reverse">
            {downloadURL && (
              <SimpleTooltip content={downloadLabel}>
                <a href={downloadURL} target="_blank" rel="noopener noreferrer">
                  <Button size="icon-sm">
                    <Download className="size-3.5" />
                  </Button>
                </a>
              </SimpleTooltip>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ModFileList({ className }: ModFileListProps) {
  "use no memo";
  const { activatedModFiles } = useMapComboContext();
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: activatedModFiles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    gap: 12,
    paddingStart: 12,
    paddingEnd: 8,
    overscan: 3,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <div ref={parentRef} className={cn("overflow-auto", className)}>
      <div
        className="relative w-full"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        <div
          className="absolute top-0 left-0 w-full space-y-3"
          style={{
            transform: `translateY(${items[0]?.start ?? 0}px)`,
          }}
        >
          {items.map((virtualItem) => {
            const modFile = activatedModFiles[virtualItem.index];
            if (!modFile) {
              return null;
            }
            return (
              <ModFile
                key={virtualItem.key}
                data={modFile}
                ref={virtualizer.measureElement}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
