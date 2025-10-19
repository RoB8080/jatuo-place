import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["en", "zh", "ru"],
  extract: {
    input: ["src/**/*.{ts,tsx}"],
    output: "public/locales/{{language}}/{{namespace}}.json",
    defaultNS: "common",
    preservePatterns: ["mod-category.*.name", "mod.*"],
  },
});
