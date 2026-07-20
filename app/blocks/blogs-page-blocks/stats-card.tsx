"use client";

import { Card, CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";

// Animate Counter
import  AnimatedCounter  from "@/app/blocks/Animate-Components/Animate-counter";

import { Blog } from "@/app/Types/blog.type";

// STATS ICONS  ------------------------------------------------------------
import { FaBook as Blogs } from "react-icons/fa6";
import { RiDraftLine as Draft } from "react-icons/ri";
import { TiTickOutline as Published } from "react-icons/ti";
import { UserRoundPen as Author } from 'lucide-react';


interface StatsCardProps {
  blogsData: Blog[];
}


export default function StatsCard ( { blogsData }: StatsCardProps ) {

  const totalBlogs = blogsData.length;

  const totalUniqueAuthors = new Set(blogsData.map((blog) => blog.author._id)).size; 

  const totalDrafts = blogsData.filter(
    (blog) => blog.status === "draft"
  ).length;

  const totalPublished = blogsData.filter(
    (blog) => blog.status === "published"
  ).length;


  const stats = [
    {
      label: "Total Blogs",
      value: totalBlogs,
      icon: Blogs,
      color: "from-blue-500/20 via-blue-400/10 to-transparent",
      glow: "hover:shadow-blue-500/20",
    },
    {
      label: "Drafts",
      value: totalDrafts,
      icon: Draft,
      color: "from-zinc-500/20 via-zinc-400/10 to-transparent",
      glow: "hover:shadow-zinc-500/20",
    },
    {
      label: "Total Published",
      value: totalPublished,
      icon: Published,
      color: "from-black/20 via-zinc-700/10 to-transparent",
      glow: "hover:shadow-black/20",
    },
    {
      label: "Total Authors",
      value: totalUniqueAuthors,
      icon: Author,
      color: "from-sky-500/20 via-blue-400/10 to-transparent",
      glow: "hover:shadow-sky-500/20",
    },
  ];


    return(
        
                //   STATS CARDS
                  <div className="flex gap-4 my-6 px-4">
                
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
                          // whileHover={{ rotate: 6, scale: 1.1 }}
                          whileHover={{ scale: 1.1 }}
                          // transition={{ type: "spring", stiffness: 300 }}
                          // transition={{ type: " ", stiffness: 300 }}
                          className="mb-2 text-muted-foreground group-hover:text-foreground"
                        >
                          <p className="text-md group-hover:text-muted-foreground/80 border-b pb-1">
                            {label}
                          </p>
        
                        </motion.div>

                        <div className="flex gap-3 items-center w-fit">
                          <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.15,
                            }}
                            className="text-[35px] my-3 font-bold tracking-tight"
                          >
                            <AnimatedCounter value={value} />
                          </motion.p>

                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.3,
                            }}
                          >
                            <Icon size={18} className="text-[#E85129]" />
                          </motion.div>
                        </div>
        
                
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                        </div>
    )
}