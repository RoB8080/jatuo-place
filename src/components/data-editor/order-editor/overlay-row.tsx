import { Item, ItemMedia, ItemContent } from "../../ui/item";

export function OverlayRow(props: {
  name: string;
  modName?: string;
  posterURL?: string;
}) {
  const { name, modName, posterURL } = props;
  return (
    <Item
      variant="outline"
      size="sm"
      className="z-[60] cursor-grabbing bg-card shadow-lg"
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
    </Item>
  );
}
