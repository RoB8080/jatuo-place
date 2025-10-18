import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "../theme";
import { Separator } from "@/components/ui/separator";
import { ExternalLinks } from "./atoms";

export interface NavWebProps {
  className?: string;
}

export function NavWeb({ className }: NavWebProps) {
  const { t } = useTranslation("common");
  const location = useRouterState({ select: (state) => state.location });
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem className="shrink-0">
          <NavigationMenuLink
            data-active={location.pathname.startsWith("/map-combo")}
            className="data-[status='active']:font-bold"
            asChild
          >
            <Link to="/map-combo">{t(($) => $.routes.mapCombo)}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="shrink-0">
          <NavigationMenuLink
            data-active={location.pathname.startsWith("/data-editor")}
            className="data-[status='active']:font-bold"
            asChild
          >
            <Link to="/data-editor">{t(($) => $.routes.dataEditor)}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function ActionsWeb() {
  return (
    <>
      <ThemeSwitcher size="sm" />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <ExternalLinks />
    </>
  );
}
