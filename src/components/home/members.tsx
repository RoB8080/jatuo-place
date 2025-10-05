import { useTranslation } from "react-i18next";
import { FlexibleBox } from "@/components/common/flexible-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { FC } from "react";
import Bilibili from "@/assets/svgs/brand/bilibili.svg?react";
import Kuaishou from "@/assets/svgs/brand/kuaishou.svg?react";
import Trucky from "@/assets/svgs/brand/trucky.svg?react";

import { Button } from "../ui/button";
import { HandHeart } from "lucide-react";

type Roles =
  // t("member.role.rc_mapper", { ns: "home" })
  | "rc_mapper"
  // t("member.role.programmer", { ns: "home" })
  | "programmer"
  // t("member.role.def_fixer", { ns: "home" })
  | "def_fixer"
  // t("member.role.miscellaneous", { ns: "home" })
  | "miscellaneous"
  // t("member.role.ui_engineer", { ns: "home" })
  | "ui_engineer"
  // t("member.role.web_developer", { ns: "home" })
  | "web_developer"
  // t("member.role.vtc_manager", { ns: "home" })
  | "vtc_manager";

interface MemberInfo {
  name: string;
  avatar: string;
  roles: Roles[];
  externalLinks?: {
    icon: FC<{ className?: string }>;
    href: string;
  }[];
  donateHref?: string;
}

const memberInfos: MemberInfo[] = [
  {
    name: "Rxx2008",
    avatar: "/members/images/avatar.rxx2008.jpg",
    roles: ["rc_mapper", "miscellaneous"],
    externalLinks: [
      {
        icon: Trucky,
        href: "https://truckymods.io/user/273265#projects",
      },
      {
        icon: Bilibili,
        href: "https://space.bilibili.com/3546639839005383",
      },
      {
        icon: Kuaishou,
        href: "https://www.kuaishou.com/profile/3x84qcyvfehr3kw",
      },
    ],
    donateHref: "https://www.paypal.com/paypalme/rxx2008",
  },
  {
    name: "Jane",
    avatar: "/members/images/avatar.jane.jpg",
    roles: ["programmer", "rc_mapper", "def_fixer"],
    externalLinks: [
      {
        icon: Trucky,
        href: "https://truckymods.io/user/273265#projects",
      },
      {
        icon: Bilibili,
        href: "https://space.bilibili.com/472090875",
      },
    ],
  },
  {
    name: "Joseph",
    avatar: "/members/images/avatar.joseph.jpg",
    roles: ["rc_mapper"],
    externalLinks: [
      {
        icon: Trucky,
        href: "https://truckymods.io/user/273265#projects",
      },
    ],
  },
  {
    name: "Sūn_Siro14",
    avatar: "/members/images/avatar.sun_siro14.jpg",
    roles: ["rc_mapper"],
    externalLinks: [
      {
        icon: Trucky,
        href: "https://truckymods.io/user/273265#projects",
      },
    ],
  },
  {
    name: "初一爱笑啊",
    avatar: "/members/images/avatar.chu_yi_ai_xiao_a.jpg",
    roles: ["vtc_manager"],
  },
  {
    name: "RoB8080",
    avatar: "/members/images/avatar.rob8080.jpg",
    roles: ["web_developer"],
  },
];

function Member({ info }: { info: MemberInfo }) {
  const { t } = useTranslation("home");
  return (
    <div className="relative flex flex-row gap-8 rounded-xl bg-muted p-8">
      <div className="flex-none">
        <Avatar className="size-16">
          <AvatarImage src={info.avatar} />
          <AvatarFallback>{info.name}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-auto">
        <div className="text-xl leading-8 font-medium text-foreground">
          {info.name}
        </div>
        <div className="text-sm leading-5 font-medium text-muted-foreground">
          {info.roles.map((role) => t(($) => $.member.role[role])).join(" / ")}
        </div>
        <div className="mt-1 -ml-2 flex flex-row">
          {info.externalLinks?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="text-muted-foreground"
                variant="ghost"
                size="icon"
              >
                <link.icon className="size-5" />
              </Button>
            </a>
          ))}
        </div>
      </div>

      {info.donateHref && (
        <a
          className="absolute top-3 right-3"
          key={info.donateHref}
          href={info.donateHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="text-muted-foreground transition-all hover:text-primary"
            variant="ghost"
          >
            <HandHeart className="size-5" />
            <div>{t(($) => $.members.donate)}</div>
          </Button>
        </a>
      )}
    </div>
  );
}

export function Members() {
  const { t } = useTranslation("home");
  return (
    <FlexibleBox
      as="section"
      data-slot="members"
      className="py-12"
      innerClassName="flex flex-col gap-8 px-4 md:flex-row md:px-0"
    >
      <div className="top-8 md:sticky md:w-[240px] ">
        <h2>{t(($) => $.members.title)}</h2>
        <p className="pt-4 font-medium text-muted-foreground">
          {t(($) => $.members.description)}
        </p>
      </div>
      <div className="flex flex-auto flex-col gap-4">
        {memberInfos.map((member) => (
          <Member key={member.name} info={member} />
        ))}
      </div>
    </FlexibleBox>
  );
}
