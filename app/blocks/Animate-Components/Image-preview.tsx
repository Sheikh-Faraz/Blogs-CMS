"use client";

import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

interface ImagePreviewProps {
  src: string;
  children: ReactNode;
  alt?: string;
}

export default function ImagePreview({
  src,
  children,
  alt = "Image",
}: ImagePreviewProps) {
  const [open, setOpen] = useState(false);

  if (!src) return <>{children}</>;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group relative cursor-zoom-in"
      >
        {children}

        <div
          className="
            absolute inset-0
            flex items-center justify-center
            rounded-inherit
            transition-all
            duration-200
          "
          // className="
          //   absolute inset-0
          //   flex items-center justify-center
          //   rounded-inherit
          //   bg-black/0
          //   transition-all
          //   duration-200
          //   group-hover:bg-black/20
          // "
        >
          <ZoomIn className="h-8 w-8 text-orange-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>
      </div>

<AnimatePresence>
  {open && (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute top-6 right-6 z-20 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="size-6" />
      </button>

      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 24,
        }}
      >
        <div className="relative h-[80vh] w-[97vw]">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="97vw"
            className="object-contain select-none"
          />
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}