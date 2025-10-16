import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { Item, ItemMedia, ItemContent, ItemActions } from "../../ui/item";
import { Button } from "../../ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "../../ui/button-group";
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown } from "lucide-react";
import { cn } from "@/libs/utils";

function toTransformString(
  transform?: { x: number; y: number; scaleX?: number; scaleY?: number } | null,
) {
  if (!transform) return undefined;
  const tx = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  const sx =
    transform.scaleX !== undefined || transform.scaleY !== undefined
      ? ` scale(${transform.scaleX ?? 1}, ${transform.scaleY ?? 1})`
      : "";
  return `${tx}${sx}`;
}

export function SortableRow(props: {
  id: string;
  name: string;
  posterURL?: string;
  modName?: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  registerNode: (id: string, node: HTMLElement | null) => void;
  onMoveTop: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveBottom: () => void;
}) {
  const {
    id,
    name,
    posterURL,
    modName,
    isFirst,
    isLast,
    registerNode,
    onMoveTop,
    onMoveUp,
    onMoveDown,
    onMoveBottom,
  } = props;
  const { t } = useTranslation("data-editor");
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const handleRef = (node: HTMLElement | null) => {
    setNodeRef(node);
    registerNode(id, node);
  };
  return (
    <Item
      ref={handleRef}
      variant="outline"
      size="sm"
      style={{ transform: toTransformString(transform), transition }}
      className={cn(
        "cursor-grab bg-card active:cursor-grabbing",
        isDragging && "opacity-0",
      )}
      {...attributes}
      {...listeners}
    >
      {posterURL && (
        <ItemMedia variant="image" className="h-18 w-24">
          <img src={posterURL} alt={name} />
        </ItemMedia>
      )}
      <ItemContent className="leading-snug">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{modName ?? "—"}</div>
      </ItemContent>
      <ItemActions>
        <ButtonGroup>
          <Button
            aria-label={t(($) => $.orderPanel.moveTop)}
            variant="outline"
            size="icon-sm"
            onClick={onMoveTop}
            disabled={isFirst}
          >
            <ChevronsUp className="size-4" />
          </Button>
          <Button
            aria-label={t(($) => $.orderPanel.moveUp)}
            variant="outline"
            size="icon-sm"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ArrowUp className="size-4" />
          </Button>
          <ButtonGroupSeparator />
          <Button
            aria-label={t(($) => $.orderPanel.moveDown)}
            variant="outline"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ArrowDown className="size-4" />
          </Button>
          <Button
            aria-label={t(($) => $.orderPanel.moveBottom)}
            variant="outline"
            size="icon-sm"
            onClick={onMoveBottom}
          >
            <ChevronsDown className="size-4" />
          </Button>
        </ButtonGroup>
      </ItemActions>
    </Item>
  );
}
