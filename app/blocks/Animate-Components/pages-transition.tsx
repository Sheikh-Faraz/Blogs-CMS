"use client";

import { motion } from "framer-motion";
import { useGlobalLoading } from "@/context/Loading.context";

const columns = 8;

export default function PageTransition() {
  const { phase } = useGlobalLoading();

  return (
    <div className="fixed inset-0 z-9999 flex pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-[#E85129] origin-bottom"
          animate={{
            scaleY: phase === "enter" || phase === "hold" ? 1 : 0,
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}
    </div>
  );
}