import { Link } from "@tanstack/react-router";
import { FlexibleBox } from "../common/flexible-box";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Truck } from "lucide-react";

export function Hero() {
  const { t } = useTranslation("home");
  return (
    <FlexibleBox
      as="section"
      data-slot="hero"
      innerClassName="flex flex-col px-8 py-24 text-center"
    >
      <h1 className="text-[48px] font-black md:text-[64px] lg:text-[76px]">
        Jatuo's Place
      </h1>
      <p className="mx-6 mt-4 mb-7 text-base text-muted-foreground md:mt-5 md:mb-8 md:text-lg lg:mt-6 lg:mb-10 lg:text-xl">
        {t(($) => $.hero.description)}
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link to="/map-combo/ets2-155">
          <Button
            variant="default"
            type="button"
            size="lg"
            className="font-bold"
          >
            {t(($) => $.hero.actions["start-to-use"])}
            <Truck className="size-4" />
          </Button>
        </Link>
      </div>
    </FlexibleBox>
  );
}
