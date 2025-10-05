import { FlexibleBox } from "@/components/common/flexible-box";
import {
  DataEditorActions,
  DataEditorProvider,
} from "@/components/data-editor";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data-editor")({
  component: RouteComponent,
});
// t('routes.data-editor')

function RouteComponent() {
  return (
    <DataEditorProvider>
      <FlexibleBox className="flex-auto" innerAsChild>
        <div className="flex h-full flex-row py-2">
          <div className="flex w-60 flex-col gap-2">
            <DataEditorActions />
            <div className="flex-auto rounded-md border bg-card"></div>
          </div>
        </div>
      </FlexibleBox>
    </DataEditorProvider>
  );
}
