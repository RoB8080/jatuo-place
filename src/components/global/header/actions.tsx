import {
  DiscordLinkButton,
  DropdownMenuComposite,
  GithubLinkButton,
  QQLinkButton,
} from "@/components/common";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/libs/common";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/ui/shadcn-io/theme-switcher";

export function HeaderActions() {
  const { t } = useTranslation("global");
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <DropdownMenuComposite
        className="w-[220px]"
        content={
          <>
            <DropdownMenuLabel className="flex items-center flex-row justify-between">
              <div>{t(($) => $.header.appearance)}</div>
              <ThemeSwitcher size="sm" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2">
              <GithubLinkButton />
              <QQLinkButton />
              <DiscordLinkButton />
            </div>
          </>
        }
      >
        {
          <Button variant="ghost" size="icon">
            <Ellipsis />
          </Button>
        }
      </DropdownMenuComposite>
    );
  }

  return (
    <>
      <ThemeSwitcher size="sm" />
      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-4"
      />
      <div className="flex items-center gap-2">
        <GithubLinkButton />
        <QQLinkButton />
        <DiscordLinkButton />
      </div>
    </>
  );
}
