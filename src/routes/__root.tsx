import { AppHeader } from "@/components/global/header";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootLayout = () => (
  <div className="min-h-svh w-full flex flex-col">
    <AppHeader />
    <Outlet />
  </div>
);

export const Route = createRootRoute({ component: RootLayout });
