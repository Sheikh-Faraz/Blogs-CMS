"use client";

import Image from "next/image";

import UserImagePlaceholder from "@/public/UserImagePlaceholder.png";

// import { motion } from "framer-motion";

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

type Author = {
  fullName: string;
  banner: string;
  profilePic: string;
  role?: string;
  email?: string;
};

export default function AuthorHoverCard({ author }: { author: Author }) {
  return (
    <HoverCard openDelay={100} closeDelay={150}>
      {/* TRIGGER */}
      <HoverCardTrigger asChild>
        <div
          className="
            flex w-fit max-w-full cursor-pointer items-center gap-2
            rounded-full bg-card border
            pl-2 pr-3 transition hover:bg-muted/40
            sm:pr-5
          "
        >
          <Image
            src={author.profilePic || UserImagePlaceholder.src}
            alt="Profile Picture"
            height={35}
            width={35}
            className="h-8 w-8 shrink-0 rounded-full sm:h-8.75 sm:w-8.75"
          />

          <div className="min-w-0">
            <p className="max-w-20 truncate pt-1 text-[11px] font-semibold sm:text-[12px]">
              {author.fullName}
            </p>

            <p className="max-w-20 truncate pt-1 text-[10px] text-muted-foreground sm:text-[12px]">
              {author.role || "No Role"}
            </p>
          </div>
        </div>
      </HoverCardTrigger>

      {/* CARD */}
      <HoverCardContent
        side="bottom"
        align="center"
        sideOffset={8}
        className="
          w-[calc(100vw-2rem)]
          max-w-80
          overflow-hidden
          rounded-xl
          border
          p-0
          shadow-xl
        "
      >
        {/* <motion.div */}
        <div
          // initial={{ opacity: 0, y: 10, scale: 0.95 }}
          // animate={{ opacity: 1, y: 0, scale: 1 }}
          // transition={{
          //   duration: 0.25,
          //   ease: [0.22, 1, 0.36, 1],
          // }}
        >
          {/* Banner */}
          <div className="h-20 w-full sm:h-24">
            <img
              src={author.banner || ""}
              alt="banner"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Avatar */}
          <div className="-mt-8 flex justify-center sm:-mt-10">
            <Image
              src={author.profilePic || UserImagePlaceholder.src}
              alt="avatar"
              width={80}
              height={80}
              className="h-16 w-16 rounded-full border-4 border-[#E85129] sm:h-20 sm:w-20"
            />
          </div>

          {/* Info */}
          <div className="space-y-1 px-4 pb-5 pt-2 text-center">
            <h3 className="truncate text-base font-semibold">
              {author.fullName}
            </h3>

            <p className="truncate text-xs text-muted-foreground">
              {author.role || "No Role"}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {author.email || "No email"}
            </p>
          </div>
        {/* </motion.div> */}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

