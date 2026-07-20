"use client";

import { useEffect } from "react";
import Link from "next/link";

// Context 
import { useUser } from "@/context/User.context";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { MapPin as Location} from "lucide-react";
import { GoOrganization as Organization } from "react-icons/go";
import { MdEdit as Edit } from "react-icons/md";



// SOCIALS  ------------------------------------------------------------
import { 
    FaLinkedinIn as LinkedIn, 
    FaInstagram as Instagram, 
    FaFacebookF as Facebook, 
    FaDiscord as Discord,
    FaYoutube as Youtube  
} from "react-icons/fa";
import { FiGithub as Github } from "react-icons/fi";
import { FaXTwitter as X } from "react-icons/fa6";

const socials = [
  {
    name: "LinkedIn",
    icon: LinkedIn,
    href: "linkedin",
    color: "hover:bg-[#0A66C2] hover:text-white",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "github",
    color: "hover:bg-[#111827] hover:text-white",
  },
  {
    name: "X",
    icon: X,
    href: "x",
    color: "hover:bg-black hover:text-white",
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: "facebook",
    color: "hover:bg-[#1877F2] hover:text-white",
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "instagram",
    color: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 hover:text-white",
  },
  {
    name: "YouTube",
    icon: Youtube,
    href: "youtube",
    color: "hover:bg-[#FF0000] hover:text-white",
  },
  {
    name: "Discord",
    icon: Discord,
    href: "discord",
    color: "hover:bg-[#5865F2] hover:text-white",
  },
];



export default function HeaderCard() {

    // User Context
    const { fetchUser, authUser } = useUser();

    useEffect(() => {
        fetchUser();
    }, [])

  return (
    <div>

        {/* Profile card */}
        <Card className="overflow-hidden rounded-2xl border shadow-sm">
          {/* Hero banner */}
          <div className="relative h-40 bg-muted overflow-hidden">
            <img
              src={authUser?.defaultWorkspace?.banner || "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"}
              alt="Company banner"
              className="w-full h-full object-cover object-center"
            />

            {/* <div className="absolute top-2 ml-4">

            <button className="absolute top-3 left-3 text-black w-8 h-8 bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors">
            <button className="text-black w-8 h-8 bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-background transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>

            </div> */}
            
          </div>

          <div className="px-5 pt-0 pb-0">
            {/* Logo + edit */}
            <div className="flex items-start justify-between -mt-6 mb-3">
              <div className="w-14 h-14 rounded-2xl border-4 border-background flex items-center justify-center shadow-sm shrink-0 z-99">

                {authUser?.defaultWorkspace?.logo ?
                (
                    <img
                      src={authUser?.defaultWorkspace?.logo || ""}
                      alt="Company logo"
                      className="w-full h-full object-cover object-center"
                    />

                )
                :
                (
                    <Organization size={28} className="text-muted-foreground" />
                )}
              </div>

              <Link href="#" className="flex items-center gap-1.5 mt-5 text-white text-md font-medium border rounded-full px-3 py-2 bg-[#E85129] hover:bg-muted transition-colors">
                  <Edit className="w-4 h-4" />
                  edit workspace
              </Link>

            </div>

            {/* Company info */}
            <div className="my-3">
              <p className="text-lg mt-2 truncate max-w-90 ">
                {authUser?.defaultWorkspace?.name || "Workspace Name"}
              </p>
              <p className="text-xs text-muted-foreground my-3 flex gap-2 items-center">
                <Location className="size-4 text-orange-500" />
                {authUser?.defaultWorkspace?.location || "Location NA"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxedb truncate max-w-180">
                {authUser?.defaultWorkspace?.about || "About"}
              </p>
            </div>


            {/* Social icons */}           
            <TooltipProvider>
      <div className="flex items-center gap-4 my-6">
        {socials.map(({ name, icon: Icon, href, color }) => {
          const url = authUser?.defaultWorkspace?.socials?.[href as keyof typeof authUser.defaultWorkspace.socials] || "#";

          return (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Link
                    href={url || "#"}
                    target="_blank"
                    className={[
                      "relative flex items-center justify-center",
                      "h-10 w-10 rounded-full",
                      "bg-muted text-muted-foreground",
                      "transition-all duration-300 ease-out",
                      "shadow-sm hover:shadow-md",
                      "backdrop-blur",
                      color,
                    ].join(" ")}
                  >
                    <Icon size={16} />
                  </Link>
                </motion.div>
              </TooltipTrigger>

              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>


            <Separator />

            {/* Tabs */}
            {/* <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors relative shrink-0 ${
                    activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
                  )}
                </button>
              ))}
            </div> */}
          {/* </CardContent> */}
          </div>
        </Card>

          </div>
)
}
