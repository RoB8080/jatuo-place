import { useCallback, useState, type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDebouncedCallback } from "@/libs/common";

function getComponents(sub?: boolean) {
  if (sub) {
    return {
      Menu: DropdownMenuSub,
      Trigger: DropdownMenuSubTrigger,
      Content: DropdownMenuSubContent,
    };
  }

  return {
    Menu: DropdownMenu,
    Trigger: DropdownMenuTrigger,
    Content: DropdownMenuContent,
  };
}

export interface DropdownMenuCompositeProps {
  className?: string;
  /** The trigger element, don't wrap with DropdownMenuTrigger or DropdownMenuSubTrigger */
  children: ReactNode;
  /** The content shown in menu, don't wrap with DropdownMenuContent or DropdownMenuSubContent */
  content: ReactNode;
  /** Whether the dropdown is triggered by hover */
  detectHover?: boolean;
  /** Whether the dropdown is a submenu */
  asSub?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Hover triggered dropdown composite
 */
function DropdownMenuHoverComposite({
  className,
  children,
  content,
  asSub,
}: Omit<DropdownMenuCompositeProps, "detectHover">) {
  const [open, setOpen] = useState(false);
  const handleMouseLeave = useDebouncedCallback(
    () => {
      setOpen(false);
    },
    300,
    { edges: ["trailing"] },
  );
  const handleMouseEnter = useCallback(() => {
    setOpen(true);
    handleMouseLeave.cancel();
  }, [handleMouseLeave]);

  const { Menu, Trigger, Content } = getComponents(asSub);

  return (
    <Menu modal={false} open={open} onOpenChange={setOpen}>
      <Trigger
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        asChild
      >
        {children}
      </Trigger>
      <Content
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {content}
      </Content>
    </Menu>
  );
}

/**
 * Dropdown menu composite (menu + trigger + content)
 */
export function DropdownMenuComposite({
  className,
  children,
  content,
  detectHover,
  asSub,
  open,
  onOpenChange,
}: DropdownMenuCompositeProps) {
  if (detectHover) {
    return (
      <DropdownMenuHoverComposite
        className={className}
        children={children}
        content={content}
        asSub={asSub}
        open={open}
        onOpenChange={onOpenChange}
      />
    );
  }

  const { Menu, Trigger, Content } = getComponents(asSub);

  return (
    <Menu modal={false} open={open} onOpenChange={onOpenChange}>
      <Trigger asChild>{children}</Trigger>
      <Content className={className}>{content}</Content>
    </Menu>
  );
}
