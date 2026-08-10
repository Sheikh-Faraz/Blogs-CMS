"use client";

import Image from "next/image";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

import { motion } from "framer-motion";

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
      
      {/* TRIGGER (your table pill) */}
      <HoverCardTrigger asChild>
        <div className="flex gap-2 items-center border rounded-full bg-card w-fit pl-2 pr-5 cursor-pointer hover:bg-muted/40 transition">
          <Image
            src={author.profilePic || ""}
            alt="Profile Picture"
            height={35}
            width={35}
            className="rounded-full"
          />

          <div>
            <p className="truncate max-w-20 text-[12px] font-semibold pt-1">
              {author.fullName}
            </p>
            <p className="truncate max-w-20 text-[10px] text-muted-foreground">
              {author.role || "No Role"}
            </p>
          </div>
        </div>
      </HoverCardTrigger>

      {/* CARD */}
      <HoverCardContent className="w-80 p-0 overflow-hidden rounded-xl border shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Banner */}
          {/* <div className="h-24 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" /> */}

            <img
              src={author.banner || ""}
              alt="banner"
              // width={80}
              // height={24}
              className="w-full h-24 object-cover"
            />
          

          {/* Avatar */}
          <div className="flex justify-center -mt-10">
            <Image
              src={author.profilePic || ""}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full border-4 border-[#E85129]"
            />
          </div>

          {/* Info */}
          <div className="text-center px-4 pb-5 pt-2 space-y-1">
            <h3 className="font-semibold text-base">{author.fullName}</h3>
            <p className="text-xs text-muted-foreground">
              {author.role || "No Role"}
            </p>
            <p className="text-xs text-muted-foreground">
              {author.email || "No email"}
            </p>
          </div>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
}