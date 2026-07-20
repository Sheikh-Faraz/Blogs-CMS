// "use client";

// import React, { createContext, useContext, useState } from "react";

// interface LoadingContextType {
//   isLoading: boolean;
//   setIsLoading: (value: boolean) => void;
// }

// const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   return (
//     <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
//       {children}
//       {isLoading && (
//         <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
//         </div>
//       )}
//     </LoadingContext.Provider>
//   );
// };

// export const useGlobalLoading = () => {
//   const context = useContext(LoadingContext);
//   if (!context) {
//     throw new Error("useGlobalLoading must be used within LoadingProvider");
//   }
//   return context;
// };




"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

type Phase = "idle" | "enter" | "hold" | "exit";

interface LoadingContextType {
  phase: Phase;
  startTransition: (url: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(
  undefined
);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [nextPath, setNextPath] = useState<string | null>(null);


  const router = useRouter();
  const pathname = usePathname();


  const DURATION = 600;
  // const DURATION = 800;

  const startTransition = (url: string) => {
    setPhase("enter");
    setNextPath(url);
  };

  // 🔥 MAIN TIMELINE CONTROLLER
  // useEffect(() => {
  //   let t1: any;
  //   let t2: any;
  //   let t3: any;

  //   if (phase === "enter") {
  //     t1 = setTimeout(() => {
  //       if (nextPath) {
  //         router.push(nextPath); // ✅ REAL navigation
  //       }
  //       setPhase("hold");
  //     }, DURATION);
  //   };

  //   // if (phase === "enter") {
  //   //   t1 = setTimeout(() => {
  //   //     // change route ONLY after animation starts
  //   //     if (nextPath) {
  //   //       window.history.pushState(null, "", nextPath);
  //   //     }
  //   //     setPhase("hold");
  //   //   }, DURATION);
  //   // }

  //   if (phase === "hold") {
  //     t2 = setTimeout(() => {
  //       setPhase("exit");
  //     }, 80);
  //   }

  //   if (phase === "exit") {
  //     t3 = setTimeout(() => {
  //       setPhase("idle");
  //       setNextPath(null);
  //     }, DURATION);
  //   }

  //   return () => {
  //     clearTimeout(t1);
  //     clearTimeout(t2);
  //     clearTimeout(t3);
  //   };
  // }, [phase, nextPath]);


  useEffect(() => {
  if (phase === "enter") {
    const timer = setTimeout(() => {
      if (nextPath) {
        router.push(nextPath);
      }
    }, DURATION);

    return () => clearTimeout(timer);
  }
}, [phase, nextPath, router]);


  useEffect(() => {
  if (phase === "enter") {
    setPhase("exit");
  }
}, [pathname]);


useEffect(() => {
  if (phase === "exit") {
    const timer = setTimeout(() => {
      setPhase("idle");
      setNextPath(null);
    }, DURATION);

    return () => clearTimeout(timer);
  }
}, [phase]);


  return (
    <LoadingContext.Provider value={{ phase, startTransition }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx)
    throw new Error("useGlobalLoading must be used within provider");
  return ctx;
};