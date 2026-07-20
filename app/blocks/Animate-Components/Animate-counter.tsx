"use client";

import { animate, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
}

export default function AnimatedCounter({
  value,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(0);

  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 60,
    mass: 1.2,
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });

    const controls = animate(motionValue, value, {
      duration: 2.5,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [value, motionValue, springValue]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
    >
      {displayValue}
    </motion.span>
  );
}