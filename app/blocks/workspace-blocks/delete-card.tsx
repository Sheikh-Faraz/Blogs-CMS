"use client";

import { useEffect } from "react";

// Context 
import { useUser } from "@/context/User.context";

import { Card, CardContent } from "@/components/ui/card";

import { AiOutlineWarning as Warning } from "react-icons/ai";

import { motion } from "framer-motion";


export default function DeleteCard() {

    // User Context
    const { fetchUser, authUser } = useUser();

    useEffect(() => {
        fetchUser();
    }, [])

  return (
    <div>

        {/* Delete */}
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
                <Warning size={18} className="text-red-500"/>
                <span className="text-xl font-bold text-red-500">Danger Zone</span>
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
                className="leading-relaxed flex justify-between"
              >
                <div>
                    <p className="text-md font-bold text-muted-foreground">Delete {authUser?.defaultWorkspace?.name || "Workspace"}</p>
                    <p className="text-xs text-red-400 my-2">Are you sure you want to delete this workspace?</p>
                </div>
                <button className="px-2 rounded-md bg-red-600 text-white">Delete Workspace</button>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>

          </div>
)
}
