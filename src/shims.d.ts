/// <reference types="vite-plugin-svgr/client" />

import "i18next";
import { I18NextResources, defaultNS } from "@/libs/i18n";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: I18NextResources;
    enableSelector: true;
  }
}
