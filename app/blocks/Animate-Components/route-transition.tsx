"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageWipe from "./Page-wipe";

export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [showWipe, setShowWipe] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    setShowWipe(true);

    const timeout = setTimeout(() => {
      setContent(children);
      setShowWipe(false);
    }, 600); // match animation duration

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <AnimatePresence>{showWipe && <PageWipe />}</AnimatePresence>
      {content}
    </>
  );
}