import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export interface TooltipProps {
  children?: ReactNode;
  content?: ReactNode;
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <TooltipPrimitive>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </TooltipPrimitive>
  );
}
