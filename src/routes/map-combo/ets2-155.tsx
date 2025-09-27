import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/map-combo/ets2-155")({
  component: RouteComponent,
});
// t('routes.map-combo.ets2-155')

function RouteComponent() {
  return <div>123Hello "/map-combo/ets2-155"!</div>;
}
