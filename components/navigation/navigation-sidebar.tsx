import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-actions";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="z-50 space-y-4 flex flex-col items-center h-full text-primary w-full py-3 bg-slate-300 dark:bg-[#1e1f22] b-[#E3E5E8]">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            name={server.name}
            imageUrl={server.imageUrl}
          />
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          appearance={{ elements: { avatarBox: "h-[48px] w-[48px]" } }}
        />
      </div>
    </div>
  );
};
