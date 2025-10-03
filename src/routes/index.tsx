import { FlexibleBox } from "@/components/common/flexible-box";
import { About } from "@/components/home/about";
import { Hero } from "@/components/home/hero";
import { Members } from "@/components/home/members";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});
// t('routes.home')

function Index() {
  return (
    <div className="flex-auto overflow-auto">
      <Hero />
      <FlexibleBox>
        <Separator />
      </FlexibleBox>
      <About />
      <FlexibleBox>
        <Separator />
      </FlexibleBox>
      <Members />
    </div>
  );
}
