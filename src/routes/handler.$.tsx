import { stackClientApp } from "@/libs/infra/stack";
import { StackHandler } from "@stackframe/react";
import { createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/handler/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();
  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}
