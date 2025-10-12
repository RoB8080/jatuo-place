import { mapComboDataSchema, type MapComboData } from "@/libs/map-combo";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  type ComponentProps,
} from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Form } from "../ui/form";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useLocalStorage } from "@uidotdev/usehooks";

export interface DataEditorContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<MapComboData, any, MapComboData>;
  /** Overwrite form data */
  overwrite: (data: MapComboData) => void;
}

const DataEditorContext = createContext<DataEditorContextValue | null>(null);

function saveAsJSON(data: unknown, invalid?: boolean) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `map-combo${invalid ? ".invalid" : ""}.${dayjs().format("YYYYMMDD")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataEditorRoot(
  props: Omit<ComponentProps<"form">, "onSubmit">,
) {
  const [workingData, setWorkingData] = useLocalStorage<MapComboData>(
    "data-editor__working-data",
    {
      categories: [],
      mods: [],
      files: [],
    },
  );
  const form = useForm<MapComboData>({
    resolver: standardSchemaResolver(mapComboDataSchema),
    defaultValues: workingData,
  });

  useEffect(() => {
    return form.subscribe({
      formState: {
        values: true,
      },
      callback: ({ values }) => {
        setWorkingData(values);
      },
    });
  }, [form, setWorkingData]);

  const overwrite = useCallback(
    (data: MapComboData) => {
      form.setValue("categories", data.categories);
      form.setValue("mods", data.mods);
      form.setValue("files", data.files, {
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form],
  );

  const handleValidSubmit = useCallback((data: MapComboData) => {
    saveAsJSON(data);
  }, []);

  const handleInvalidSubmit = useCallback(
    (err: unknown) => {
      console.error("invalid data", err);
      toast.warning("数据不符合要求，将保存临时版本");
      saveAsJSON(form.getValues(), true);
    },
    [form],
  );

  return (
    <DataEditorContext.Provider value={{ overwrite, form }}>
      <Form {...form}>
        <form
          {...props}
          onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        />
      </Form>
    </DataEditorContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataEditorContext() {
  const context = useContext(DataEditorContext);
  if (context === null) {
    throw new Error(
      "useDataEditorContext must be used within a DataEditorProvider",
    );
  }
  return context;
}
