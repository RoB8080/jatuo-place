import { uniq } from "es-toolkit";
import { ChevronRight, Dot } from "lucide-react";
import {
  createContext,
  useContext,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/libs/utils";
import { SimpleTooltip } from "./tooltip";

type TreeSize = "sm" | "md";

interface TreeContextValue {
  size: TreeSize;
  expandedKeys: string[];
  onExpandKeysChange: (keys: string[]) => void;
}

const TreeContext = createContext<TreeContextValue>({
  size: "md",
  expandedKeys: [],
  onExpandKeysChange: () => {},
});

export interface TreeRootProps extends ComponentProps<"div"> {
  size?: TreeSize;
  expandedKeys?: string[];
  onExpandKeysChange?: (keys: string[]) => void;
  children: ReactNode;
}

export function TreeRoot(props: TreeRootProps) {
  const {
    className,
    size = "md",
    expandedKeys: propExpandedKeys,
    onExpandKeysChange: propOnExpandKeysChange,
    children,
    ...rest
  } = props;

  const [innerExpandedKeys, setInnerExpandedKeys] = useState<string[]>([]);
  const expandedKeys = propExpandedKeys ?? innerExpandedKeys;
  const onExpandKeysChange = propOnExpandKeysChange ?? setInnerExpandedKeys;

  return (
    <TreeContext.Provider
      value={{
        size,
        expandedKeys,
        onExpandKeysChange,
      }}
    >
      <div data-slot="tree-root" className={className} {...rest}>
        {children}
      </div>
    </TreeContext.Provider>
  );
}

interface NodeContextValue {
  depth: number;
  baseID: string | null;
}

const NodeContext = createContext<NodeContextValue>({
  depth: 0,
  baseID: null,
});

export interface TreeNodeProps {
  className?: string;
  id: string;
  /** sub nodes */
  subNodes?: ReactNode;
  /** content of this node */
  children: ReactNode;
}

const treeNodeVariants = cva(
  "group/tree-node flex w-full items-center gap-2 rounded-md hover:bg-accent",
  {
    variants: {
      size: {
        sm: "rounded-sm p-1.5 text-sm [&>svg]:size-3",
        md: "rounded-md p-2 text-base [&>svg]:size-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export function TreeNode(props: TreeNodeProps) {
  const { className, id, subNodes, children } = props;
  const { expandedKeys, onExpandKeysChange, size } = useContext(TreeContext);
  const { depth, baseID } = useContext(NodeContext);
  const fullID = baseID ? `${baseID}-${id}` : id;

  const isExpanded = expandedKeys.includes(fullID);
  const onIsExpandedChange = () => {
    if (isExpanded) {
      onExpandKeysChange(expandedKeys.filter((key) => key !== fullID));
    } else {
      onExpandKeysChange(uniq([...expandedKeys, fullID]));
    }
  };

  if (!subNodes) {
    return (
      <div className={cn(treeNodeVariants({ size }), className)}>
        <Dot className="text-muted-foreground" />
        {children}
      </div>
    );
  }

  return (
    <NodeContext.Provider
      value={{
        depth: depth + 1,
        baseID: baseID ?? id,
      }}
    >
      <Collapsible open={isExpanded} onOpenChange={onIsExpandedChange}>
        <CollapsibleTrigger
          data-open={isExpanded}
          className={cn(treeNodeVariants({ size }), className)}
          asChild
        >
          <div>
            <ChevronRight className="transition-transform group-data-[open=true]/tree-node:rotate-90" />
            {children}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="ml-6 space-y-1">
          {subNodes}
        </CollapsibleContent>
      </Collapsible>
    </NodeContext.Provider>
  );
}

const treeNodeTitleVariants = cva("flex flex-auto items-center", {
  variants: {
    size: {
      sm: "gap-1.5 [&>svg]:size-3.5",
      md: "gap-2 [&>svg]:size-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export function TreeNodeTitle(props: ComponentProps<"div">) {
  const { className, children, ...rest } = props;
  const { size } = useContext(TreeContext);
  return (
    <div className={cn(treeNodeTitleVariants({ size }), className)} {...rest}>
      {children}
    </div>
  );
}

const treeNodeActionVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md [&_svg]:pointer-events-none [&_svg]:shrink-0 ",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        destructive:
          "text-destructive/60 hover:bg-destructive/20 hover:text-destructive/70",
      },
      size: {
        sm: "size-4.5 [&_svg]:size-3.5",
        md: "size-5 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface TreeNodeActionProps
  extends Omit<ComponentProps<"button">, "type">,
    Pick<VariantProps<typeof treeNodeActionVariants>, "variant"> {
  tooltip?: string;
}

export function TreeNodeAction(props: TreeNodeActionProps) {
  const { className, variant = "default", tooltip, ...rest } = props;
  const { size } = useContext(TreeContext);
  const button = (
    <button
      type="button"
      className={cn(treeNodeActionVariants({ size, variant }), className)}
      {...rest}
    />
  );

  return tooltip ? (
    <SimpleTooltip content={tooltip}>{button}</SimpleTooltip>
  ) : (
    button
  );
}
