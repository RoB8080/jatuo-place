import { AlertDialogRoot } from "@/components/common/alert-dialog";
import { AppHeader } from "@/components/global/header";
import { Toaster } from "@/components/ui/sonner";
import { stackClientApp } from "@/libs/infra/stack";
import { StackProvider, StackTheme } from "@stackframe/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => (
  <StackTheme>
    <QueryClientProvider client={queryClient}>
      <StackProvider app={stackClientApp}>
        <div className="flex h-svh w-full flex-col">
          <AppHeader />
          <Outlet />
        </div>
        <Toaster expand={true} visibleToasts={5} />
        <AlertDialogRoot />
      </StackProvider>
    </QueryClientProvider>
  </StackTheme>
);

export const Route = createRootRoute({ component: RootLayout });
