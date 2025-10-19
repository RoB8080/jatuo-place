import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export interface NavWebProps {
  className?: string;
}

export function NavWeb({ className }: NavWebProps) {
  const { t } = useTranslation("common");
  const homeLabel = t(($) => $.routes.home);
  const mapComboLabel = t(($) => $.routes.mapCombo);
  const dataEditorLabel = t(($) => $.routes.dataEditor);

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem className="shrink-0">
          <NavigationMenuLink
            data-active={location.pathname === "/"}
            className="data-[status='active']:font-bold"
            asChild
          >
            <Link to="/">{homeLabel}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="shrink-0">
          <NavigationMenuLink
            data-active={location.pathname.startsWith("/map-combo")}
            className="data-[status='active']:font-bold"
            asChild
          >
            <Link to="/map-combo">{mapComboLabel}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="shrink-0">
          <NavigationMenuLink
            data-active={location.pathname.startsWith("/data-editor")}
            className="data-[status='active']:font-bold"
            asChild
          >
            <Link to="/data-editor">{dataEditorLabel}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
