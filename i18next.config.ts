import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["en", "zh", "ru"],
  extract: {
    input: ["src/**/*.{ts,tsx}"],
    output: "src/locale/{{language}}/{{namespace}}.json",
    defaultNS: "common",
    preservePatterns: ["routes.*", "*.dynamic.*"],
    functions: ["t", "i18n.t", "i18next.t"],
  },
});
