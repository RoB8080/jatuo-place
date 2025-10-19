import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "@tanstack/react-router";
import { router } from "./router";

export const stackClientApp = new StackClientApp({
  projectId: import.meta.env.VITE_STACK_PROJECT_ID,
  publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate: () => {
      const navigate = useNavigate();
      return (to: string) => navigate({ to });
    },
    navigate: (to: string) => {
      router.navigate({ to });
    },
  },
  urls: {
    signIn: "/sign-in",
  },
});
