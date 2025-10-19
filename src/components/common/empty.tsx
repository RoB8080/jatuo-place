import type { ComponentProps, ReactNode } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "../ui/empty";
import { useTranslation } from "react-i18next";
import { PackageOpen } from "lucide-react";

export interface SimpleEmptyProps {
  className?: string;
  mediaVariant?: ComponentProps<typeof EmptyMedia>["variant"];
  media?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  contentClassName?: string;
  /** content of the empty state */
  children?: ReactNode;
}

export function SimpleEmpty(props: SimpleEmptyProps) {
  const { t } = useTranslation("common");
  const {
    className,
    mediaVariant = "icon",
    media = <PackageOpen />,
    title = t(($) => $.empty.noData),
    description,
    contentClassName,
    children,
  } = props;

  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant={mediaVariant}>{media}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {children && (
        <EmptyContent className={contentClassName}>{children}</EmptyContent>
      )}
    </Empty>
  );
}
