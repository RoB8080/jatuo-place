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

function RouteComponent() {
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
          <div className="flex flex-row items-center justify-between gap-2 p-2 pb-0">
            <div className="flex flex-row items-center gap-2">
              <SidebarTrigger
                className="bg-card hover:bg-accent"
                variant="outline"
              />
              <VersionSelect className="bg-card hover:bg-accent" />
            </div>
          </div>
          <ModFileList className="flex-auto overflow-auto px-2" />
        </SidebarInset>
      </SidebarProvider>
    </MapComboProvider>
  );
}

export const Route = createFileRoute("/map-combo")({
  component: RouteComponent,
});
// t('routes.map-combo')
