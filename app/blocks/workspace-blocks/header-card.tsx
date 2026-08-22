"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Full Page Image preview/show
import ImagePreview from "@/app/blocks/Animate-Components/Image-preview";


// For editing the active workspace
import EditWorkspaceDialog from "@/app/blocks/workspace-blocks/workspace-edit-dialog";

// Images
import EmptyStateImage from "@/public/No-img-placeholder.png";


// Context 
import { useUser } from "@/context/User.context";


// For Animation
import { motion } from "framer-motion";


// Components
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";


// Icons
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
    const { 
      fetchUser, 
      // authUser, 

      CurrentActiveWorkspace, 
      workspace,
    } = useUser();



    useEffect(() => {

        fetchUser();                // Fetch the authorized/current user's info

        CurrentActiveWorkspace();   // Fetch the current active workspace details

    }, [])


    const [editWorkspaceOpen, setEditWorkspaceOpen] = useState(false);


  // Your actual workspace from context/API
  const ActiveWorkspace = {
    _id: workspace?._id || "workspace-id-123546789",
    name: workspace?.name || "My Workspace",
    logo: workspace?.logo || "/logo.png",
    banner: workspace?.banner || "/banner.jpg",
    about: workspace?.about || "My workspace about text",
    location: workspace?.location || "Workspace's location",
    founded: workspace?.founded || null,
    slug: workspace?.slug || "my-workspace",

    socials: {
      linkedin: {
        url: workspace?.socials?.linkedin?.url || "https://linkedin.com/company/example",
        visible: workspace?.socials?.linkedin?.visible ?? false,
      },
      github: {
        url: workspace?.socials?.github?.url || "https://github.com/example",
        visible: workspace?.socials?.github?.visible ?? false,
      },
      x: {
        url: workspace?.socials?.x?.url || "",
        visible: workspace?.socials?.x?.visible ?? false,
      },
      facebook: {
        url: workspace?.socials?.facebook?.url || "",
        visible: workspace?.socials?.facebook?.visible ?? false,
      },
      instagram: {
        url: workspace?.socials?.instagram?.url || "https://instagram.com/example",
        visible: workspace?.socials?.instagram?.visible ?? false,
      },
      youtube: {
        url: workspace?.socials?.youtube?.url || "",
        visible: workspace?.socials?.youtube?.visible ?? false,
      },
      discord: {
        url: workspace?.socials?.discord?.url || "",
        visible: workspace?.socials?.discord?.visible ?? false,
      },
    },
  };



  return (
    <div>

        {/* Profile card */}
        <Card className="overflow-hidden rounded-2xl border shadow-sm">


          {/* Dialog that opens to edit the current workspace */}
          <EditWorkspaceDialog
            open={editWorkspaceOpen}
            onOpenChange={setEditWorkspaceOpen}
            ActiveWorkspace={ActiveWorkspace}
          />


          {/* Hero banner */}

          <div className="h-80 overflow-auto m-2 rounded-md bg-muted flex items-center justify-center">
                                                  <ImagePreview src={workspace?.banner || EmptyStateImage.src}>
                                                    <img
                                                      src={workspace?.banner || EmptyStateImage.src}
                                                      alt="Profile Banner"
                                                      className="w-full h-full"
                                                    />
                                                  </ImagePreview>  
          
                                          </div>




          <div className="px-5 pt-0 pb-0">
            {/* Logo + edit */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 rounded-2xl border-4 border-[#E85129] flex items-center justify-center shadow-sm shrink-0">

                {workspace?.logo ?
                (
                      <ImagePreview src={workspace?.logo || EmptyStateImage.src}>
                        <img
                            src={workspace?.logo || EmptyStateImage.src}
                            alt="Workspace logo"
                            className="w-full h-full rounded-xl"
                        />
                      </ImagePreview>  
                )
                :
                (
                    <Organization size={28} className="text-muted-foreground" />
                )}
              </div>


              <Button 
                variant="outline"
                // className="flex items-center gap-1.5 mt-5 text-md font-medium border rounded-full px-3 py-2 hover:bg-muted transition-colors bg-card text-card-foreground"
                className="flex items-center gap-1.5 mt-5 text-md font-medium  px-3 py-2"
                onClick={() => setEditWorkspaceOpen(true)}
              >
                  <Edit className="w-4 h-4 text-[#E85129]" />
                  edit workspace
              </Button>

            </div>

            {/* Company info */}
            <div className="my-3">
              <p className="text-lg mt-2 truncate max-w-90">
                {workspace?.name || "Workspace Name"}
              </p>
              <p className="text-xs text-muted-foreground my-3 flex gap-2 items-center">
                <Location className="size-4 text-[#E85129]" />
                {workspace?.location || "Location NA"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxedb truncate max-w-180">
                {workspace?.about || "About"}
              </p>
            </div>


            {/* Social icons */}           
            <TooltipProvider>
      <div className="flex items-center gap-4 my-6">
        {/* {socials.map(({ name, icon: Icon, href, color, visible }) => { */}
        {socials.map(({ name, icon: Icon, href, color }) => {
          const url = workspace?.socials?.[href as keyof typeof workspace.socials]?.url || "#";

          const isVisible = workspace?.socials?.[href as keyof typeof workspace.socials]?.visible ?? false;
          if (!isVisible) {
            return null; // Skip rendering if not visible
          }

          return (
            <Tooltip key={name}>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Link
                    // href={url || "#"}
                    href={url}
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

          </div>
        </Card>

          </div>
)
}
