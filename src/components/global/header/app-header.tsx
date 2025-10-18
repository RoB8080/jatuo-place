import { Separator } from "@/components/ui/separator";
import { LanguageSelect } from "../locale/";
import { MenuMobile } from "./mobile";
import { cn } from "@/libs/utils";
import logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";
import { useIsMobile } from "@/libs/common";
import { ActionsWeb, NavWeb } from "./web";

export interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3",
        className,
      )}
    >
      <div
        data-slot="header-left"
        className="flex min-w-fit grow-1 basis-0 flex-row items-center gap-2"
      >
        <Link className="flex flex-row items-center gap-2" to="/">
          <img
            src={logo}
            className="flex aspect-square size-7 items-center justify-center rounded-[6px] bg-sidebar-primary text-sidebar-primary-foreground"
            alt="logo"
          />
          <span className="text-xl font-bold">Jatuo's Place</span>
        </Link>
      </div>
      {!isMobile && <NavWeb />}
      <div
        data-slot="header-right"
        className="flex grow-1 basis-0 flex-row items-center justify-end gap-2"
      >
        {isMobile ? <MenuMobile /> : <ActionsWeb />}
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <LanguageSelect />
      </div>
    </header>
  );
}
