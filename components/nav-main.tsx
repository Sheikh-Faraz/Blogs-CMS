"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useGlobalLoading } from "@/context/Loading.context";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();

  const { startTransition } = useGlobalLoading();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                href={item.url}
                key={item.title}


                onClick={(e) => {
                  if (isActive) {
                    e.preventDefault();
                    return;
                  }
                  
                  e.preventDefault();
                  
                   startTransition(item.url);
                }}

              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`
                      cursor-pointer p-4! my-2 transition-all duration-200

                      ${
                        isActive
                          // ? "bg-transparent! text-[#E85129]! hover:text-foreground!"
                          ? "bg-[#E85129]! text-white! hover:text-gray-300! rounded-md py-5!"
                          : "bg-transparent! text-muted-foreground hover:text-[#E85129]!"
                      }
                    `}
                  >
                    <div className={
                      isActive
                      ? "bg-transparent!"
                      : "bg-muted! rounded-full"
                    }
                    >
                      {item.icon}
                    </div>

                    <span className="text-base">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}