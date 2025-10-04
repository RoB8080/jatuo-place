import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export interface SimpleTooltipProps {
  children?: ReactNode;
  content?: ReactNode;
  asChild?: boolean;
}

export function SimpleTooltip({
  children,
  content,
  asChild = true,
}: SimpleTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}
