"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type ImageOnHoverProps = {
  src: string;
};

export default function ImageOnHover({ src }: ImageOnHoverProps) {
  return (
    <HoverCard openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        <div className="w-full h-full cursor-pointer overflow-hidden ">
          <Image
            src={src}
            alt="Preview"
            width={100}
            height={100}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 rounded-md"
            unoptimized
          />
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        side="right"
        align="start"
        className="w-[320px] p-2 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          <Image
            src={src}
            alt="Preview"
            width={500}
            height={300}
            className="w-full h-auto rounded-md object-cover"
            unoptimized
          />
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
}