import { Check, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { SimpleDropdownMenu } from "@/components/common";

export function LanguageSelect() {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const indicator = <Check className="ml-auto" />;

  return (
    <SimpleDropdownMenu
      content={
        <>
          <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
            English
            {language === "en" && indicator}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => i18n.changeLanguage("zh")}>
            中文
            {language === "zh" && indicator}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => i18n.changeLanguage("ru")}>
            Русский
            {language === "ru" && indicator}
          </DropdownMenuItem>
        </>
      }
    >
      <Button variant="ghost" size="icon">
        <Languages className="size-4" />
        <span className="sr-only">Select language</span>
      </Button>
    </SimpleDropdownMenu>
  );
}
