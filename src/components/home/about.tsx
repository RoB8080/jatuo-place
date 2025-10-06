import { useTranslation } from "react-i18next";
import { FlexibleBox } from "@/components/common/flexible-box";

export function About() {
  const { t } = useTranslation("home");
  return (
    <FlexibleBox
      as="section"
      data-slot="about"
      className="py-12"
      innerClassName="flex flex-col"
    >
      <h2>{t(($) => $.about.title)}</h2>
      <p className="pt-4 font-medium text-muted-foreground">
        {t(($) => $.about["paragraph-1"])}
      </p>
      <p className="pt-2 font-medium text-muted-foreground">
        {t(($) => $.about["paragraph-2"])}
      </p>
    </FlexibleBox>
  );
}
