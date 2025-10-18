import {
  DiscordLinkButton,
  GithubLinkButton,
  QQLinkButton,
} from "@/components/common";

export function ExternalLinks() {
  return (
    <div className="flex items-center gap-2">
      <GithubLinkButton />
      <QQLinkButton />
      <DiscordLinkButton />
    </div>
  );
}
