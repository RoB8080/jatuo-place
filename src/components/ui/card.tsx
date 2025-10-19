import { cn } from "@/libs/utils";
import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";

type CardSize = "sm" | "md";
type CardVariant = "default" | "dashed";

const cardVariants = cva(
  "group/card flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      size: {
        sm: "gap-4 py-4",
        md: "gap-6 py-6",
      } satisfies Record<CardSize, string>,
      variant: {
        default: "border border-border",
        dashed: "border border-dashed border-border",
      } satisfies Record<CardVariant, string>,
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

function Card({
  className,
  size = "md",
  variant = "default",
  ...props
}: ComponentProps<"div"> & { size?: CardSize; variant?: CardVariant }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ size, variant }), className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 group-data-[size=sm]/card:gap-1 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
