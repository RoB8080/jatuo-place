import { createElement, type ComponentProps, type JSX } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/libs/utils";

type FlexibleBoxElement = keyof JSX.IntrinsicElements;

export type FlexibleBoxProps<Element extends FlexibleBoxElement = "div"> =
  ComponentProps<Element> & {
    as?: Element;
    innerAsChild?: boolean;
    innerClassName?: string;
  };

export function FlexibleBox<Element extends FlexibleBoxElement = "div">({
  as = "div" as Element,
  className,
  innerAsChild,
  innerClassName,
  children,
  ...props
}: FlexibleBoxProps<Element>) {
  return createElement(
    as,
    {
      className: cn("w-full", className),
      ...props,
    },
    <FlexibleBoxInner asChild={innerAsChild} className={innerClassName}>
      {children}
    </FlexibleBoxInner>,
  );
}

function FlexibleBoxInner({
  asChild,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "mx-auto w-3xl max-w-[calc(100%-32px)] xl:w-4xl 2xl:w-7xl",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
