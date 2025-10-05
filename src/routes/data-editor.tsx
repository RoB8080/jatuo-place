import { SimpleDropdownMenu } from "@/components/common";
import { FlexibleBox } from "@/components/common/flexible-box";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Box, Import, MoreHorizontalIcon, Tags } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/data-editor")({
  component: RouteComponent,
});
// t('routes.data-editor')

const tabs = [
  {
    // t("tab.category", { ns: "data-editor" })
    key: "category",
    icon: <Tags />,
  },
  {
    // t("tab.mod", { ns: "data-editor" })
    key: "mod",
    icon: <Box />,
  },
] as const;

function RouteComponent() {
  const { t } = useTranslation("data-editor");
  return (
    <FlexibleBox>
      <Tabs defaultValue={tabs[0].key}>
        <div className="flex flex-row items-center justify-between py-2">
          <TabsList className="select-none">
            {tabs.map((tab) => (
              <TabsTrigger
                className="cursor-pointer"
                key={tab.key}
                value={tab.key}
              >
                {tab.icon}
                {t(($) => $.tab[tab.key])}
              </TabsTrigger>
            ))}
          </TabsList>
          <div>
            <ButtonGroup>
              <Button size="sm" variant="outline">
                <Import />
                导入配置
              </Button>
              <SimpleDropdownMenu content={1234}>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="More Options"
                >
                  <MoreHorizontalIcon />
                </Button>
              </SimpleDropdownMenu>
            </ButtonGroup>
          </div>
        </div>
        <TabsContent value="category">1234</TabsContent>
        <TabsContent value="mod">5678</TabsContent>
      </Tabs>
    </FlexibleBox>
  );
}
