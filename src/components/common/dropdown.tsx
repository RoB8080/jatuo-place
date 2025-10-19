import { type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface SimpleDropdownMenuProps {
  /** The class name of the dropdown menu content */
  className?: string;
  /** Trigger element */
  children: ReactNode;
  /** Content element */
  content: ReactNode;
}

export function SimpleDropdownMenu({
  className,
  children,
  content,
}: SimpleDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className={className}>{content}</DropdownMenuContent>
    </DropdownMenu>
  );
}
