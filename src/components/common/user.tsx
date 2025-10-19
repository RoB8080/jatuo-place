import { useMemo, type ComponentProps } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { getAvatarFallback } from "@/libs/common/avatar";

export interface UserAvatarProps extends ComponentProps<"span"> {
  avatarURL: string | null;
  displayName: string;
}

export function UserAvatar({
  avatarURL,
  displayName,
  ...rest
}: UserAvatarProps) {
  const fallbackText = useMemo(
    () => getAvatarFallback(displayName, { maxLength: 2 }),
    [displayName],
  );
  return (
    <Avatar {...rest}>
      <AvatarImage src={avatarURL ?? undefined} />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
