"use client";

import { useEffect } from "react";

// Context 
import { useUser } from "@/context/User.context";

import { Card, CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";

import { AiOutlineExclamationCircle as Exclamation } from "react-icons/ai";




// STATS  ------------------------------------------------------------
import { FaUser as User } from "react-icons/fa";
import { RiBookShelfLine as Blogs } from "react-icons/ri";
import { TiTickOutline as Published } from "react-icons/ti";
import { CiRead as Read } from "react-icons/ci";


const stats = [
  {
    label: "Team Members",
    value: 10,
    icon: User,
    color: "from-blue-500/20 via-blue-400/10 to-transparent",
    glow: "hover:shadow-blue-500/20",
  },
  {
    label: "All Blogs",
    value: 10,
    icon: Blogs,
    color: "from-zinc-500/20 via-zinc-400/10 to-transparent",
    glow: "hover:shadow-zinc-500/20",
  },
  {
    label: "Published Blogs",
    value: 10,
    icon: Published,
    color: "from-black/20 via-zinc-700/10 to-transparent",
    glow: "hover:shadow-black/20",
  },
  {
    label: "Users Read",
    value: 10,
    icon: Read,
    color: "from-sky-500/20 via-blue-400/10 to-transparent",
    glow: "hover:shadow-sky-500/20",
  },
];


export default function AboutCard() {

    // User Context
    const { fetchUser, authUser } = useUser();

    useEffect(() => {
        fetchUser();
    }, [])

  return (
    <div>

        {/* STATS CARDS */}
          <div className="flex gap-3 my-6">
        
          {stats.map(({ icon: Icon, label, value, color, glow }) => (
          <motion.div
            key={label}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative w-full"
          >
            {/* Glow background layer */}
            <div
              className={[
                "absolute inset-0 rounded-xl opacity-0 blur-xl transition-all duration-300",
                "group-hover:opacity-100",
                glow,
              ].join(" ")}
            />
        
            <Card
              className={[
                "relative overflow-hidden rounded-xl w-full",
                // "bg-background/60 backdrop-blur-md",
                "backdrop-blur-md",
                "transition-all duration-300",
                "hover:shadow-lg",
                "group",
              ].join(" ")}
            >
              {/* animated gradient overlay */}
              <div
                className={[
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  `bg-linear-to-br ${color}`,
                ].join(" ")}
              />
        
              <CardContent className="relative p-4">
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="mb-2 text-muted-foreground group-hover:text-foreground"
                >
                  <div className="bg-muted p-2 w-fit rounded-md">
                    <Icon size={18} className="text-orange-500"/>
                  </div>
                </motion.div>
        
                <p className="text-xs text-muted-foreground mb-1 group-hover:text-muted-foreground/80">
                  {label}
                </p>
        
                <p className="text-xl font-bold tracking-tight group-hover:scale-105 transition-transform">
                  {value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
                </div>




        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ y: -3 }}
          className="my-6"
        >
          <Card 
            // className="relative overflow-hidden rounded-xl border bg-background/60 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300"
            className="relative overflow-hidden rounded-xl border backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300"
          >
            
            {/* soft gradient glow layer */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-violet-500/10 via-transparent to-blue-500/10" />

            <CardContent className="relative p-5">
              
              {/* Header */}
              <motion.h2
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-semibold tracking-tight mb-3"
              >

              <span className="flex gap-2 items-center">
                <Exclamation size={18} className="text-orange-500"/>
                <span className="text-xl">About {authUser?.defaultWorkspace?.name || "Workspace"}</span>
              </span>

              </motion.h2>

              {/* Divider line (subtle animation) */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="h-px w-full bg-border mb-4 origin-left"
              />

              {/* Text */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-muted-foreground leading-relaxed"
              >
                {authUser?.defaultWorkspace?.about || "No description available for this workspace yet."}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>

          </div>
)
}
