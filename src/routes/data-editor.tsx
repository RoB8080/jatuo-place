import { FlexibleBox } from "@/components/common/flexible-box";
import { DataEditorActions, DataEditorRoot } from "@/components/data-editor";
import { CategoryEditor } from "@/components/data-editor/category-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { Box, Group, ListOrdered } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/data-editor")({
  component: RouteComponent,
});
// t('routes.data-editor')

const tabs = [
  {
    // t("tabs.category", { ns: "data-editor" })
    key: "category",
    icon: Group,
    render: () => <CategoryEditor />,
  },
  {
    // t("tabs.mod", { ns: "data-editor" })
    key: "mod",
    icon: Box,
    render: () => <div>Mod</div>,
  },
  {
    // t("tabs.order", { ns: "data-editor" })
    key: "order",
    icon: ListOrdered,
    render: () => <div>Order</div>,
  },
] as const;

function RouteComponent() {
  const { t } = useTranslation("data-editor");
  return (
    <Tabs className="flex-auto pt-2" defaultValue={tabs[0].key} asChild>
      <DataEditorRoot>
        <FlexibleBox
          data-slot="data-editor__header"
          className="flex-none"
          innerClassName="flex flex-row justify-between"
        >
          <TabsList variant="outline">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                <tab.icon className="size-4" />
                {t(($) => $.tabs[tab.key])}
              </TabsTrigger>
            ))}
          </TabsList>
          <DataEditorActions />
        </FlexibleBox>
        <FlexibleBox
          data-slot="data-editor__body"
          className="flex-auto"
          innerClassName="h-full"
        >
          {tabs.map((tab) => (
            <TabsContent
              className="h-full"
              asChild
              key={tab.key}
              value={tab.key}
            >
              {tab.render()}
            </TabsContent>
          ))}
        </FlexibleBox>
      </DataEditorRoot>
    </Tabs>
  );
}
