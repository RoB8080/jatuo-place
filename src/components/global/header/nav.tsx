import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";

export function HeaderNav() {
  const { t } = useTranslation("common");
  const location = useRouterState({ select: (state) => state.location });
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className="mr-1 p-0" asChild>
            <Link to="/">
              <img
                src={logo}
                className="flex aspect-square size-8 items-center justify-center rounded-[6px] bg-sidebar-primary text-sidebar-primary-foreground"
                alt="logo"
              />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            active={location.pathname.startsWith("/map-combo")}
            asChild
            className="text-accent-foreground data-[active]:font-semibold"
          >
            <Link to="/map-combo">{t(($) => $.routes["map-combo"])}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            active={location.pathname.startsWith("/data-editor")}
            asChild
            className="text-accent-foreground data-[active]:font-semibold"
          >
            <Link to="/data-editor">{t(($) => $.routes["data-editor"])}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
