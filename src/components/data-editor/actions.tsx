import { FileDown, FileUp, MoreHorizontalIcon } from "lucide-react";
import { SimpleDropdownMenu } from "../common";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useDataEditorContext } from "./root";
import { cn } from "@/libs/utils";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem, DropdownMenuLabel } from "../ui/dropdown-menu";
import { loadVersionData, versionKeys } from "@/libs/map-combo";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useId } from "react";

export interface DataEditorActionsProps {
  className?: string;
}

export function DataEditorActions(props: DataEditorActionsProps) {
  const { className } = props;
  const { overwrite } = useDataEditorContext();
  const { t } = useTranslation("data-editor");
  const fileInputID = useId();
  const { mutate: loadFromVersion, isPending: isLoadingFromVersion } =
    useMutation({
      mutationFn: async (versionKey: string) => {
        const data = await loadVersionData(versionKey);
        if (!data) {
          throw new Error("Failed to load version data");
        }
        return data;
      },
      onSuccess: (data) => {
        overwrite(data);
      },
      onError: (error) => {
        console.error(error);
        // t("actions.failed-loading-prod-data", { ns: "data-editor" })
        toast.error(t(($) => $.actions["failed-loading-prod-data"]));
      },
    });

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <ButtonGroup>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const fileInput = document.getElementById(
              fileInputID,
            ) as HTMLInputElement;
            fileInput.click();
          }}
        >
          <input className="hidden" type="file" id={fileInputID} />
          <FileUp />
          {t(($) => $.actions.load)}
        </Button>
        <SimpleDropdownMenu
          content={
            <>
              <DropdownMenuLabel className="text-sm font-normal text-muted-foreground">
                {t(($) => $.actions["from-prod-data"])}
              </DropdownMenuLabel>
              {versionKeys.map((versionKey) => (
                <DropdownMenuItem
                  key={versionKey}
                  onClick={() => loadFromVersion(versionKey)}
                >
                  {versionKey}
                </DropdownMenuItem>
              ))}
            </>
          }
        >
          <Button
            disabled={isLoadingFromVersion}
            variant="outline"
            size="icon-sm"
            aria-label="More Options"
          >
            {isLoadingFromVersion ? <Spinner /> : <MoreHorizontalIcon />}
          </Button>
        </SimpleDropdownMenu>
      </ButtonGroup>
      <Button size="sm" variant="outline" type="submit">
        <input className="hidden" type="file" />
        <FileDown />
        {t(($) => $.actions.save)}
      </Button>
    </div>
  );
}
