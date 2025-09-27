import type { ComponentProps, CSSProperties, FC } from "react";

import Github from "@/assets/svgs/brand/github.svg?react";
import QQ from "@/assets/svgs/brand/qq.svg?react";
import Discord from "@/assets/svgs/brand/discord.svg?react";
import { cn } from "@/libs/utils";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Tooltip } from "./tooltip";

type ExternalLinkData = {
  href: string;
  icon: FC;
  localeKey: string;
  brandColor: string;
  darkBrandColor?: string;
};

const externalLinks = {
  github: {
    href: "https://github.com/RoB8080/jatuo-place",
    icon: Github,
    // t('external.github')
    localeKey: "github",
    brandColor: "#181717",
    darkBrandColor: "#fff",
  },
  qq: {
    href: "https://qm.qq.com/q/k6N64hXRLi",
    icon: QQ,
    // t('external.qq')
    localeKey: "qq",
    brandColor: "#1EBAFC",
    darkBrandColor: undefined,
  },
  discord: {
    href: "https://discord.com/invite/naXvDxGkE9",
    icon: Discord,
    // t('external.discord')
    localeKey: "discord",
    brandColor: "#5865F2",
    darkBrandColor: undefined,
  },
} as const satisfies Record<string, ExternalLinkData>;

// For locale type safety
type AvailableExternalLinkData =
  (typeof externalLinks)[keyof typeof externalLinks];

function ExternalLinkButton({
  className,
  target,
  ...props
}: Omit<ComponentProps<typeof Button>, "variant" | "size" | "children"> & {
  target: AvailableExternalLinkData;
}) {
  const { t } = useTranslation("common");
  return (
    <Tooltip
      key={target.localeKey}
      content={t(($) => $.external[target.localeKey])}
    >
      <a href={target.href} target="_blank">
        <Button
          className={cn(
            className,
            "hover:text-(--brand-color) dark:hover:text-(--brand-color-dark)",
          )}
          variant="ghost"
          size="icon"
          style={
            {
              "--brand-color": target.brandColor,
              "--brand-color-dark": target.darkBrandColor ?? target.brandColor,
            } as CSSProperties
          }
          {...props}
        >
          <target.icon />
        </Button>
      </a>
    </Tooltip>
  );
}

export function GithubLinkButton({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "variant" | "size" | "children">) {
  return ExternalLinkButton({
    className,
    target: externalLinks.github,
    ...props,
  });
}

export function QQLinkButton({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "variant" | "size" | "children">) {
  return ExternalLinkButton({
    className,
    target: externalLinks.qq,
    ...props,
  });
}

export function DiscordLinkButton({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "variant" | "size" | "children">) {
  return ExternalLinkButton({
    className,
    target: externalLinks.discord,
    ...props,
  });
}
