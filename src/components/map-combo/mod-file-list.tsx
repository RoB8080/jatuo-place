import { useRef } from "react";
import { Card, CardContent } from "../ui/card";
import { useMapComboContext } from "./context";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/libs/utils";

export interface ModFileListProps {
  className?: string;
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
            const { name, posterURL } = activatedModFiles[virtualItem.index];
            return (
              <Card
                size="sm"
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
              >
                <CardContent className="flex gap-3">
                  {posterURL && (
                    <img
                      src={posterURL}
                      alt={name}
                      className="h-22 w-auto flex-none rounded-md"
                    />
                  )}
                  <div>
                    <h4>{name}</h4>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
