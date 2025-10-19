import { FileDown, FileUp, MoreHorizontalIcon } from "lucide-react";
import { SimpleDropdownMenu } from "../common";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { useDataEditorContext } from "./root";
import { cn } from "@/libs/utils";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem, DropdownMenuLabel } from "../ui/dropdown-menu";
import {
  loadVersionData,
  mapComboDataSchema,
  versionKeys,
  type MapComboData,
} from "@/libs/map-combo";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useId } from "react";
import dayjs from "dayjs";
import { z } from "zod";

export interface DataEditorActionsProps {
  className?: string;
}

function saveDataAsJSON(data: unknown, invalid?: boolean) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `map-combo${invalid ? ".invalid" : ""}.${dayjs().format("YYYYMMDD")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function useDataEditorActionsLocales() {
  const { t } = useTranslation("data-editor");
  return {
    load: t(($) => $.actions.load),
    fromProdData: t(($) => $.actions["from-prod-data"]),
    failedLoadingProdData: t(($) => $.actions["failed-loading-prod-data"]),
    save: {
      label: t(($) => $.actions.save.label),
      validationFailedTitle: t(
        ($) => $.actions["save"]["validation-failed"].title,
      ),
      exceptionTip: t(
        ($) => $.actions["save"]["validation-failed"]["exception-tip"],
      ),
      saveAnyway: t(
        ($) => $.actions["save"]["validation-failed"]["save-anyway"],
      ),
    },
  };
}

function handleClickSave(
  workingData: MapComboData,
  locales: {
    title: string;
    exceptionTip: string;
    saveAnyway: string;
  },
) {
  try {
    const validatedData = mapComboDataSchema.parse(workingData);
    saveDataAsJSON(validatedData);
  } catch (error) {
    const title = locales.title;

    const toastContent =
      error instanceof z.ZodError ? (
        <section>
          <h5>{title}</h5>
          {error.issues.map((issue) => (
            <p key={issue.path.join(".")}>
              {issue.path.join(".")}: {issue.message}
            </p>
          ))}
        </section>
      ) : (
        <section>
          <h5>{title}</h5>
          <p>{locales.exceptionTip}</p>
        </section>
      );

    toast.error(toastContent, {
      action: (
        <Button onClick={() => saveDataAsJSON(workingData, true)}>
          {locales.saveAnyway}
        </Button>
      ),
    });
  }
}

export function DataEditorActions(props: DataEditorActionsProps) {
  const { className } = props;
  const { workingData, setWorkingData } = useDataEditorContext();
  const locales = useDataEditorActionsLocales();
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
      onSuccess: (data) => setWorkingData(data),
      onError: (error) => {
        console.error(error);
        toast.error(locales.failedLoadingProdData);
      },
    });

  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <ButtonGroup>
        <Button
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
          {locales.load}
        </Button>
        <SimpleDropdownMenu
          content={
            <>
              <DropdownMenuLabel className="text-sm font-normal text-muted-foreground">
                {locales.fromProdData}
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
            size="icon"
            aria-label="More Options"
          >
            {isLoadingFromVersion ? <Spinner /> : <MoreHorizontalIcon />}
          </Button>
        </SimpleDropdownMenu>
      </ButtonGroup>
      <Button
        variant="outline"
        onClick={() =>
          handleClickSave(workingData, {
            title: locales.save.validationFailedTitle,
            exceptionTip: locales.save.exceptionTip,
            saveAnyway: locales.save.saveAnyway,
          })
        }
      >
        <input className="hidden" type="file" />
        <FileDown />
        {locales.save.label}
      </Button>
    </div>
  );
}
