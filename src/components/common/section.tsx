import { cn } from "@/libs/utils";
import type { ComponentProps } from "react";

export interface SectionProps extends ComponentProps<"section"> {
  wrapperClassName?: string;
}

export function Section({
  className,
  children,
  wrapperClassName,
  title,
  ...props
}: SectionProps) {
  return (
    <section
      title={title}
      className={cn("flex flex-col", wrapperClassName)}
      {...props}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 md:px-0",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
