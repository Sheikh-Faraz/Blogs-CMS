"use client";

import { motion } from "framer-motion";

const columns = 8;

export default function PageWipe() {
  return (
    <div className="fixed inset-0 z-9999 flex pointer-events-none">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 bg-zinc-950 origin-bottom"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.55,
            delay: i * 0.05,
            ease: [0.76, 0, 0.24, 1],
          }}
        />
      ))}
    </div>
  );
}