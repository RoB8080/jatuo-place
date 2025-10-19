import { SimpleDropdownMenu } from "@/components/common";
import { UserAvatar } from "@/components/common/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/libs/utils";
import {
  OAuthButton,
  useUser,
  type CurrentInternalUser,
  type CurrentUser,
} from "@stackframe/react";
import {
  DiscordLinkButton,
  GithubLinkButton,
  QQLinkButton,
} from "@/components/common";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher, useTheme } from "../theme";
import { toast } from "sonner";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Link, useRouterState } from "@tanstack/react-router";
import { useIsMobile } from "@/libs/common";
import { useState } from "react";

function SignOutDialog({
  user,
  open,
  onOpenChange,
}: {
  user: CurrentUser | CurrentInternalUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation("auth");

  const confirmTitle = t(($) => $.signOut.confirm.title);
  const confirmMessage = t(($) => $.signOut.confirm.message);
  const confirmConfirm = t(($) => $.signOut.confirm.confirm);
  const confirmCancel = t(($) => $.signOut.confirm.cancel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{confirmTitle}</DialogTitle>
        <DialogDescription>{confirmMessage}</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{confirmCancel}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => user.signOut()}>
            {confirmConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SignOutDropdownItem({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation("auth");

  const signOutLabel = t(($) => $.signOut.signOut);

  return (
    <DropdownMenuItem
      onClick={() => {
        onClick();
      }}
    >
      {signOutLabel}
    </DropdownMenuItem>
  );
}

function SignInDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation("auth");

  const signInTitle = t(($) => $.signIn.signIn);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[400px] max-w-[90svw]"
        showCloseButton={false}
      >
        <DialogTitle className="text-center">{signInTitle}</DialogTitle>
        <div className="my-2 space-y-2.5">
          <OAuthButton type="sign-in" provider="google" />
          <OAuthButton type="sign-in" provider="github" />
        </div>
        <DialogClose asChild>
          <Button variant="outline">{t(($) => $.signIn.cancel)}</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function SignInDropdownItem({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation("auth");

  const signInLabel = t(($) => $.signIn.signIn);

  return (
    <DropdownMenuItem
      onClick={() => {
        onClick();
      }}
    >
      {signInLabel}
    </DropdownMenuItem>
  );
}

const nextThemeMap = {
  light: "dark",
  dark: "system",
  system: "light",
} as const;

function ThemeSwitcherDropdownItem() {
  const { t } = useTranslation("common");
  const label = t(($) => $.theme.label);
  const { setTheme, theme } = useTheme();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextTheme = nextThemeMap[theme];
    setTheme(nextTheme);
    const nextThemeLabel = t(($) => $.theme[nextTheme]);
    const switchToast = t(($) => $.theme.switchToast, {
      theme: nextThemeLabel,
    });
    toast.success(switchToast);
  };

  return (
    <DropdownMenuItem
      className="justify-between"
      onClick={(e) => {
        e.preventDefault();
        handleClick(e);
      }}
    >
      {label}
      <ThemeSwitcher size="sm" className="pointer-events-none" />
    </DropdownMenuItem>
  );
}

function UserDropdownItem({
  user,
}: {
  user: CurrentUser | CurrentInternalUser;
}) {
  const { t } = useTranslation("auth");
  const noDisplayName = t(($) => $.displayName.noName);
  return (
    <>
      <Item className="border-none p-2" size="sm">
        <ItemMedia>
          <UserAvatar
            className="size-12"
            avatarURL={user.profileImageUrl}
            displayName={user.displayName ?? ""}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            {user.displayName || (
              <span className="text-muted-foreground">{noDisplayName}</span>
            )}
          </ItemTitle>
          <ItemDescription>{user.primaryEmail}</ItemDescription>
        </ItemContent>
      </Item>
      <DropdownMenuSeparator />
    </>
  );
}

function RoutesDropdownMenuGroup() {
  const { t } = useTranslation("common");
  const location = useRouterState({ select: (state) => state.location });
  const homeLabel = t(($) => $.routes.home);
  const mapComboLabel = t(($) => $.routes.mapCombo);
  const dataEditorLabel = t(($) => $.routes.dataEditor);
  const routesLabel = t(($) => $.routes.routes);

  return (
    <>
      <DropdownMenuLabel>{routesLabel}</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link data-active={location.pathname === "/"} to="/">
            {homeLabel}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            data-active={location.pathname.startsWith("/map-combo")}
            to="/map-combo"
          >
            {mapComboLabel}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            data-active={location.pathname.startsWith("/data-editor")}
            to="/data-editor"
          >
            {dataEditorLabel}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />
    </>
  );
}

export interface HeaderMenuProps {
  className?: string;
}

export function HeaderMenu({ className }: HeaderMenuProps) {
  const user = useUser();
  const isMobile = useIsMobile();
  const [openSignOutDialog, setOpenSignOutDialog] = useState(false);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);

  const content = (
    <>
      {user && (
        <>
          <UserDropdownItem user={user} />
        </>
      )}
      {isMobile && <RoutesDropdownMenuGroup />}
      <ThemeSwitcherDropdownItem />
      {user ? (
        <SignOutDropdownItem onClick={() => setOpenSignOutDialog(true)} />
      ) : (
        <SignInDropdownItem onClick={() => setOpenSignInDialog(true)} />
      )}
      <DropdownMenuSeparator />
      <div className="flex items-center gap-2">
        <GithubLinkButton />
        <QQLinkButton />
        <DiscordLinkButton />
      </div>
    </>
  );

  const signOutDialog = user && (
    <SignOutDialog
      user={user}
      open={openSignOutDialog}
      onOpenChange={setOpenSignOutDialog}
    />
  );

  const signInDialog = !user && (
    <SignInDialog open={openSignInDialog} onOpenChange={setOpenSignInDialog} />
  );

  return (
    <>
      <SimpleDropdownMenu content={content} className="min-w-[200px]">
        {user ? (
          <UserAvatar
            className={cn("cursor-pointer", className)}
            avatarURL={user.profileImageUrl}
            displayName={user.displayName ?? ""}
          />
        ) : (
          <Button
            className={cn("size-7", className)}
            variant="ghost"
            size="icon"
          >
            <Menu />
          </Button>
        )}
      </SimpleDropdownMenu>
      {signInDialog}
      {signOutDialog}
    </>
  );
}
