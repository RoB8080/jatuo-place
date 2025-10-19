import { Button } from "@/components/ui/button";
import { OAuthButton, StackTheme, useUser } from "@stackframe/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUser();
  const { t } = useTranslation("auth");
  const titleLabel = t(($) => $.signIn.signIn);
  const alreadySignedInLabel = t(($) => $.signIn.alreadySignedIn);
  const descriptionLabel = t(($) => $.signIn.description);
  const cancelLabel = t(($) => $.signIn.cancel);

  return (
    <StackTheme>
      <div className="flex flex-auto items-center justify-center">
        <div className="flex w-70 flex-col gap-3">
          <h3 className="text-center">{titleLabel}</h3>
          <p className="text-center text-sm text-gray-500">
            {user ? alreadySignedInLabel : descriptionLabel}
          </p>
          {!user && (
            <div className="space-y-3 py-4">
              <OAuthButton type="sign-in" provider="google" />
              <OAuthButton type="sign-in" provider="github" />
            </div>
          )}
          <Button asChild variant="outline">
            <Link to="/">{cancelLabel}</Link>
          </Button>
        </div>
      </div>
    </StackTheme>
  );
}
