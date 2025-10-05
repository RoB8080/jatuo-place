import { AppHeader } from "@/components/global/header";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <div className="flex h-svh w-full flex-col">
      <AppHeader />
      <Outlet />
    </div>
    <Toaster />
  </QueryClientProvider>
);

export const Route = createRootRoute({ component: RootLayout });
