import { createFileRoute } from "@tanstack/react-router";
import { MapComboProvider } from "@/components/map-combo/context";
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { CSSProperties } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { VersionSelect } from "@/components/map-combo/version-select";
import { ModTree } from "@/components/map-combo/mod-tree";
import { ModFileList } from "@/components/map-combo/mod-file-list";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function RouteComponent() {
  const { t } = useTranslation("map-combo");
  const tabs = [
    {
      value: "download-list",
      label: t(($) => $["tabs"]["download-list"]),
      render: () => <>123</>,
    },
    {
      value: "mod-order",
      label: t(($) => $["tabs"]["mod-order"]),
      render: () => <ModFileList className="h-full px-2" />,
    },
  ];

  return (
    <MapComboProvider>
      <SidebarProvider
        className="min-h-auto flex-auto translate-z-0 overflow-auto"
        style={{ "--sidebar-width": "320px" } as CSSProperties}
      >
        <Sidebar
          variant="floating"
          className="h-full pr-0"
          contentClassName="not-data-[mobile=true]:bg-card"
        >
          <SidebarContent>
            <ScrollArea className="h-full w-full">
              <ModTree />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </SidebarContent>
          {/* <SidebarFooter>
            <Notes />
          </SidebarFooter> */}
        </Sidebar>
        <SidebarInset>
          <Tabs defaultValue="download-list" className="min-h-0 flex-auto">
            <div className="flex flex-row items-center justify-between gap-2 p-2 pb-0">
              <div className="flex flex-row items-center gap-2">
                <SidebarTrigger variant="outline" />
                <VersionSelect />
              </div>
              <TabsList className="border">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {tabs.map((tab) => (
              <TabsContent
                className="min-h-0 flex-auto"
                key={tab.value}
                value={tab.value}
              >
                {tab.render()}
              </TabsContent>
            ))}
          </Tabs>
        </SidebarInset>
      </SidebarProvider>
    </MapComboProvider>
  );
}

export const Route = createFileRoute("/map-combo")({
  component: RouteComponent,
});
// t('routes.map-combo')
