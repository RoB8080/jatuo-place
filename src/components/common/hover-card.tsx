import type { ReactElement, ReactNode } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  type HoverCardContentProps,
} from "../ui/hover-card";
import { cn } from "@/libs/utils";

export interface SimpleHoverCardProps
  extends Pick<
    HoverCardContentProps,
    "align" | "alignOffset" | "side" | "sideOffset"
  > {
  className?: string;
  children: ReactElement;
  content: ReactNode;
}

export function SimpleHoverCard({
  className,
  children,
  content,
  ...rest
}: SimpleHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className={cn("max-w-[40svw] min-w-80", className)}
        {...rest}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}
