import { mapComboDataSchema, type MapComboData } from "@/libs/map-combo";
import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useForm, type DeepPartial, type UseFormReturn } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

export interface DataEditorContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<MapComboData, any, MapComboData>;
  /** Extract form data, if valid */
  extract: () => Promise<
    | { data: MapComboData; valid: true }
    | {
        valid: false;
        data: DeepPartial<MapComboData>;
      }
  >;
  /** Overwrite form data */
  overwrite: (data: MapComboData) => void;
}

const DataEditorContext = createContext<DataEditorContextValue | null>(null);

export function DataEditorProvider({ children }: { children: ReactNode }) {
  const form = useForm<MapComboData>({
    resolver: standardSchemaResolver(mapComboDataSchema),
    defaultValues: {
      categories: [],
      mods: [],
      files: [],
    },
  });

  const overwrite = useCallback(
    (data: MapComboData) => {
      form.setValue("categories", data.categories);
      form.setValue("mods", data.mods);
      form.setValue("files", data.files);
    },
    [form],
  );

  const extract = useCallback(() => {
    const { promise, resolve } = Promise.withResolvers<
      | { data: MapComboData; valid: true }
      | {
          valid: false;
          data: DeepPartial<MapComboData>;
        }
    >();
    form.handleSubmit(
      (data) => resolve({ valid: true, data }),
      (error) => {
        console.error("Form validation error:", error);
        resolve({ valid: false, data: form.getValues() });
      },
    )();
    return promise;
  }, [form]);

  return (
    <DataEditorContext.Provider value={{ extract, overwrite, form }}>
      {children}
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
