import { useMemo, useRef, useState } from "react";
import { useDataEditorContext } from "./root";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { cn } from "@/libs/utils";
import type { ModFile, Mod } from "@/libs/map-combo";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableRow } from "./order-editor/sortable-row";
import { OverlayRow } from "./order-editor/overlay-row";
import { SearchPopover } from "./order-editor/search-popover";

function reorder<T>(list: T[], from: number, to: number): T[] {
  if (from === to) return list;
  const next = list.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function OrderEditor({ className }: { className?: string }) {
  const { workingData, setWorkingData } = useDataEditorContext();
  const files = workingData.files;
  const modsByID = useMemo(() => {
    const map = new Map<string, Mod>();
    for (const m of workingData.mods) map.set(m.id, m);
    return map;
  }, [workingData.mods]);
  const { t } = useTranslation("data-editor");
  const [activeId, setActiveId] = useState<string | null>(null);
  // Search state moved into SearchPopover component

  // Stable ids for each file reference across reorders
  const idMapRef = useRef(new WeakMap<ModFile, string>());
  const idCounterRef = useRef(0);
  const items = useMemo(
    () =>
      files.map((file) => {
        let id = idMapRef.current.get(file);
        if (!id) {
          id = `file-${idCounterRef.current++}`;
          idMapRef.current.set(file, id);
        }
        return { id, file };
      }),
    [files],
  );

  // Matched count is computed inside SearchPopover
  const rowRefsRef = useRef(new Map<string, HTMLElement>());
  const registerNode = (id: string, node: HTMLElement | null) => {
    if (!node) rowRefsRef.current.delete(id);
    else rowRefsRef.current.set(id, node);
  };
  // locate specific row by id
  const locateById = (id: string) => {
    const el = rowRefsRef.current.get(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const flashHighlightDom = (id: string) => {
    const el = rowRefsRef.current.get(id);
    if (!el) return;
    // If already flashing, restart animation by removing and re-adding the class
    el.classList.remove("pulse-border");
    void el.offsetWidth;
    el.classList.add("pulse-border");
    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName !== "border-pulse") return;
      el.classList.remove("pulse-border");
      el.removeEventListener("animationend", handleAnimationEnd);
    };
    el.addEventListener("animationend", handleAnimationEnd);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setWorkingData((prev) => ({
      ...prev,
      files: reorder(prev.files, index, index - 1),
    }));
  };

  const moveDown = (index: number) => {
    if (index >= files.length - 1) return;
    setWorkingData((prev) => ({
      ...prev,
      files: reorder(prev.files, index, index + 1),
    }));
  };

  const moveTop = (index: number) => {
    if (index <= 0) return;
    setWorkingData((prev) => ({
      ...prev,
      files: reorder(prev.files, index, 0),
    }));
  };

  const moveBottom = (index: number) => {
    if (index >= files.length - 1) return;
    setWorkingData((prev) => ({
      ...prev,
      files: reorder(prev.files, index, prev.files.length - 1),
    }));
  };

  const countLabel = t(($) => $.file.count, { count: files.length });
  // Result count label moved into SearchPopover

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(String(active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((it) => it.id === active.id);
    const newIndex = items.findIndex((it) => it.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setWorkingData((prev) => ({
      ...prev,
      files: arrayMove(prev.files, oldIndex, newIndex),
    }));
    setActiveId(null);
  };
  const handleDragCancel = () => setActiveId(null);

  return (
    <div
      data-slot="order-editor"
      className={cn("flex flex-auto flex-col gap-2", className)}
    >
      <div className="flex flex-row items-center justify-between">
        <SearchPopover
          items={items}
          modsByID={modsByID}
          onSelectItem={(id) => {
            locateById(id);
            flashHighlightDom(id);
          }}
        />
        <div className="text-sm text-muted-foreground">{countLabel}</div>
      </div>
      <ScrollArea className="min-h-0 flex-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {items.map(({ id, file }, index) => {
                const mod = file.modID ? modsByID.get(file.modID) : undefined;
                return (
                  <SortableRow
                    key={id}
                    id={id}
                    name={file.name}
                    posterURL={file.posterURL}
                    modName={mod?.name}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === files.length - 1}
                    registerNode={registerNode}
                    onMoveTop={() => moveTop(index)}
                    onMoveUp={() => moveUp(index)}
                    onMoveDown={() => moveDown(index)}
                    onMoveBottom={() => moveBottom(index)}
                  />
                );
              })}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId
              ? (() => {
                  const activeItem = items.find((it) => it.id === activeId);
                  if (!activeItem) return null;
                  const mod = activeItem.file.modID
                    ? modsByID.get(activeItem.file.modID)
                    : undefined;
                  return (
                    <OverlayRow
                      name={activeItem.file.name}
                      modName={mod?.name}
                      posterURL={activeItem.file.posterURL}
                    />
                  );
                })()
              : null}
          </DragOverlay>
        </DndContext>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default OrderEditor;
// SortableRow and OverlayRow extracted to ./order-editor
