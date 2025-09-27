/// <reference types="vite-plugin-svgr/client" />

import "i18next";
import { resources, defaultNS } from "@/locale";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)["en"];
    enableSelector: true;
  }
}
