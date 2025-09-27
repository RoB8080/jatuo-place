import { Check, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/global/theme";
import { useTranslation } from "react-i18next";
import { DropdownMenuComposite } from "@/components/common";

export interface ThemeToggleProps {
  asSub?: boolean;
}

export function ThemeToggle({ asSub }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation("common");

  const indicator = <Check className="ml-auto" />;

  return (
    <DropdownMenuComposite
      asSub={asSub}
      content={
        <>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            {t(($) => $.theme.light)}
            {theme === "light" && indicator}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            {t(($) => $.theme.dark)}
            {theme === "dark" && indicator}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            {t(($) => $.theme.system)}
            {theme === "system" && indicator}
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="ghost" size="icon">
        <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuComposite>
  );
}
