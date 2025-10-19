import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "@/libs/utils";
import type { ComponentProps, Ref } from "react";
import { cva } from "class-variance-authority";

function ScrollArea({
  className,
  children,
  viewportRef,
  viewportClassName,
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  viewportRef?: Ref<HTMLDivElement>;
  viewportClassName?: string;
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        ref={viewportRef}
        className={cn(
          "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 [&>*:first-child]:block!",
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar className="hidden" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

const scrollBarVariants = cva(
  "group/scrollbar flex touch-none p-px transition-colors select-none",
  {
    variants: {
      orientation: {
        vertical: "h-full border-l border-l-transparent",
        horizontal: "flex-col border-t border-t-transparent",
      },
      size: {
        sm: "",
        md: "",
      },
    },
    compoundVariants: [
      {
        orientation: "vertical",
        size: "md",
        className: "w-2.5",
      },
      {
        orientation: "vertical",
        size: "sm",
        className: "w-2",
      },
      {
        orientation: "horizontal",
        size: "md",
        className: "h-2.5",
      },
      {
        orientation: "horizontal",
        size: "sm",
        className: "h-2",
      },
    ],
    defaultVariants: {
      orientation: "vertical",
      size: "md",
    },
  },
);

function ScrollBar({
  className,
  orientation = "vertical",
  size = "md",
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
  size?: "sm" | "md";
}) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      forceMount
      className={cn(
        scrollBarVariants({
          orientation,
          size,
        }),
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-border/10 transition-colors duration-300 group-data-[state=visible]/scrollbar:bg-border/90"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
