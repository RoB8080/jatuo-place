import { FileDown, FileUp, MoreHorizontalIcon } from "lucide-react";
import { SimpleDropdownMenu } from "../common";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useDataEditorContext } from "./context";
import { cn } from "@/libs/utils";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem, DropdownMenuLabel } from "../ui/dropdown-menu";
import { loadVersionData, versionKeys } from "@/libs/map-combo";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import dayjs from "dayjs";
import { useId } from "react";

export interface DataEditorActionsProps {
  className?: string;
}

function saveAsJSON(data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `map-combo.${dayjs().format("YYMMDD")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataEditorActions(props: DataEditorActionsProps) {
  const { className } = props;
  const { extract, overwrite } = useDataEditorContext();
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
        console.debug("Loaded version data:", data);
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
          size="sm"
          variant="outline"
          onClick={() => {
            const fileInput = document.getElementById(
              fileInputID,
            ) as HTMLInputElement;
            fileInput.click();
          }}
        >
          <input className="hidden" type="file" />
          <FileUp />
          {t(($) => $.actions.load)}
        </Button>
        <SimpleDropdownMenu
          content={
            <>
              <DropdownMenuLabel>
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
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          extract().then(({ valid, data }) => {
            if (valid) {
              saveAsJSON(data);
            } else {
              // t("actions.invalid-data", { ns: "data-editor" })
              toast.error(t(($) => $.actions["invalid-data"]));
            }
          })
        }
      >
        <input className="hidden" type="file" />
        <FileDown />
        {t(($) => $.actions.save)}
      </Button>
    </div>
  );
}
