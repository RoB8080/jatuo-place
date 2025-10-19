import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/libs/utils";
import { cva } from "class-variance-authority";
import { createContext, useContext, type ComponentProps } from "react";

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

type TabsListVariant = "default" | "outline";

const tabsListContext = createContext<{
  variant?: TabsListVariant;
}>({});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(tabsListContext.Provider as any).displayName = "TabsListProvider";

const tabsListVariants = cva(
  "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        outline: "border bg-background",
      } satisfies Record<TabsListVariant, string>,
    },
  },
);

function TabsList({
  className,
  variant = "default",
  ...props
}: ComponentProps<typeof TabsPrimitive.List> & {
  variant?: TabsListVariant;
}) {
  return (
    <tabsListContext.Provider value={{ variant }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </tabsListContext.Provider>
  );
}

const tabsTriggerVariants = cva(
  "inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "h-[calc(100%-1px)] data-[state=active]:bg-background data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
        outline:
          "data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
      } satisfies Record<TabsListVariant, string>,
    },
  },
);

function TabsTrigger({
  className,
  variant: propVariant = "default",
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger> & {
  variant?: TabsListVariant;
}) {
  const { variant: listVariant } = useContext(tabsListContext);
  const variant = listVariant ?? propVariant;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
