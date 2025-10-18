import { SimpleDropdownMenu } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "@/components/global/theme";
import { Link } from "@tanstack/react-router";
import { ExternalLinks } from "./atoms";

function useMenuMobileLocales() {
  const { t } = useTranslation("common");

  return {
    mapCombo: t(($) => $.routes.mapCombo),
    dataEditor: t(($) => $.routes.dataEditor),
    appearance: t(($) => $.header.appearance, { ns: "global" }),
  };
}

export function MenuMobile() {
  const { mapCombo, dataEditor, appearance } = useMenuMobileLocales();

  return (
    <SimpleDropdownMenu
      className="w-[220px]"
      content={
        <>
          <DropdownMenuItem asChild className="data-[active]:font-semibold">
            <Link
              data-active={location.pathname.startsWith("/map-combo")}
              to="/map-combo"
            >
              {mapCombo}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="data-[active]:font-semibold">
            <Link
              data-active={location.pathname.startsWith("/data-editor")}
              to="/data-editor"
            >
              {dataEditor}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex flex-row items-center justify-between">
            <div>{appearance}</div>
            <ThemeSwitcher size="sm" />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ExternalLinks />
        </>
      }
    >
      {
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      }
    </SimpleDropdownMenu>
  );
}
