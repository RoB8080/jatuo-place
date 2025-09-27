import { Separator } from "@/components/ui/separator";
import { LanguageSelect } from "../locale/";
import { HeaderActions } from "./actions";
import { FlexibleBox } from "@/components/common/flexible-box";
import { cn } from "@/libs/utils";
import { HeaderNav } from "./nav";

export interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <FlexibleBox
      as="header"
      className={cn("border-b flex-none", className)}
      innerClassName="flex h-12 shrink-0 items-center gap-2 px-4 justify-between"
    >
      <div data-slot="header-left" className="flex items-center gap-2">
        <HeaderNav />
      </div>
      <div data-slot="header-right" className="flex items-center gap-2">
        <LanguageSelect />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4"
        />
        <HeaderActions />
      </div>
    </FlexibleBox>
  );
}
