"use client";

import * as React from "react";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

// Context 
import { useUser } from "@/context/User.context";

// For Animation
import { motion } from "framer-motion";


// Images
import EmptyStateImage from "@/public/No-img-placeholder.png";


// Theme
import { useTheme } from "next-themes";

// Loaidng Skeleton
import { Skeleton } from "@/components/ui/skeleton";
import ProfileSkeleton from "@/app/blocks/loading/ProfileSkeleton";


// Full Page Image preview/show
import ImagePreview from "@/app/blocks/Animate-Components/Image-preview";


// Components
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



import toast from "react-hot-toast";
import LoaderIcon from "@/app/blocks/loading/Loader";


// Countries/Locations
import  DropdownMenuCheckboxes  from "@/app/blocks/CountrySelector";





// Icons
import { 
  MapPin as Location, 
  Check,
  AtSign,
  PencilLine as Pen,
  User,
  CircleSmall,
  Mars, 
  Venus,
  CircleMinus, 
} from "lucide-react";


import { CiImageOn as ImageIcon } from "react-icons/ci";
import { BiSolidInfoSquare as Info } from "react-icons/bi";

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



const themes = [
  {
    id: "light",
    title: "Light Mode",
  },
  {
    id: "dark",
    title: "Dark Mode",
  },
];



export default function ProfilePage() {
 
  const { theme, setTheme } = useTheme();
  
  const fileRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);
    

  // CONTEXT
  const { authUser, fetchUser, updateUserProfile, updateLoading, fetchLoading } = useUser();  


  // User Info   
  const [fullName, setFullName] = useState("");
  const [about, setAbout] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("other");
  const [location, setLocation] = useState("");

  const [socialLinks, setSocialLinks] = useState({
    linkedin:  { url: "", visible: true },
    github:    { url: "", visible: true },
    x:         { url: "", visible: true },
    facebook:  { url: "", visible: true },
    instagram: { url: "", visible: true },
    youtube:   { url: "", visible: true },
    discord:   { url: "", visible: true },
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [removeProfilePic, setRemoveProfilePic] = useState(false);


  const [banner, setBanner] = useState<File | null>(null);
  const [previewBanner, setPreviewBanner] = useState("");
  const [removeBanner, setRemoveBanner] = useState(false);


  
  useEffect(() => {
    fetchUser();
  }, []);


  // Prefill states from authUser
  useEffect(() => {
    if (!authUser) return;

    setFullName(authUser.fullName ?? "");
    setAbout(authUser.about ?? "");
    setGender(authUser.gender ?? "other");
    setLocation(authUser.location ?? "");

    setSocialLinks({
      linkedin: authUser.socials?.linkedin ?? { url: "", visible: true },
      github: authUser.socials?.github ?? { url: "", visible: true },
      x: authUser.socials?.x ?? { url: "", visible: true },
      facebook: authUser.socials?.facebook ?? { url: "", visible: true },
      instagram: authUser.socials?.instagram ?? { url: "", visible: true },
      youtube: authUser.socials?.youtube ?? { url: "", visible: true },
      discord: authUser.socials?.discord ?? { url: "", visible: true },
    });

    setPreviewImage(authUser.profilePic ?? "");
    setRemoveProfilePic(false);
    setProfilePic(null);

    setPreviewBanner(authUser.banner ?? "");
    setRemoveBanner(false);
    setBanner(null);

  }, [authUser]);


  // FOR PROFILE IMAGE UPLOAD
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfilePic(file);

    // User selected new image
    setRemoveProfilePic(false);

    const imageUrl = URL.createObjectURL(file);

    setPreviewImage(imageUrl);
  };

  const handleRemoveImage = () => {
    setProfilePic(null);

    setPreviewImage("");

    setRemoveProfilePic(true);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileRef.current?.click();
  };



  // FOR BANNER IMAGE UPLOAD
  const handleBannerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setBanner(file);

    setRemoveBanner(false);

    setPreviewBanner(URL.createObjectURL(file));
  };

  const handleRemoveBanner = () => {
    setBanner(null);

    setPreviewBanner("");

    setRemoveBanner(true);

    if (bannerRef.current) {
      bannerRef.current.value = "";
    }
  };

  const handleBannerUploadClick = () => {
    bannerRef.current?.click();
  };



  // FOR UPDATING THE PROFILE
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", fullName);
      formData.append("about", about);
      formData.append("gender", gender);
      formData.append("location", location);

      formData.append("linkedin",   JSON.stringify(socialLinks.linkedin));
      formData.append("github",     JSON.stringify(socialLinks.github));
      formData.append("x",          JSON.stringify(socialLinks.x));
      formData.append("facebook",   JSON.stringify(socialLinks.facebook));
      formData.append("instagram",  JSON.stringify(socialLinks.instagram));
      formData.append("youtube",    JSON.stringify(socialLinks.youtube));
      formData.append("discord",    JSON.stringify(socialLinks.discord));


      formData.append("removeProfilePic", String(removeProfilePic));
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      formData.append("removeBanner", String(removeBanner));
      if (banner) {
        formData.append("banner", banner);
      }


      await updateUserProfile(formData);

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to update profile."
      );
    }
  };


  if (fetchLoading) {
    return <ProfileSkeleton />;
  }


  return (
    // <div className="w-full border border-red-600 overflow-hidden">
    <div className="overflow-hidden">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-3xl font-bold">
            Profile
          </h1>
        </div>

        <Button 
          type="button"
          onClick={handleSubmit} 
          disabled={updateLoading} 
          className="rounded-none bg-muted text-white"
        >
          {updateLoading ? 
          (
            <div className="flex gap-2">
              Saving
              <LoaderIcon />
            </div>
          )
          : 
          "Update Profile"
          }
        </Button>
      </div>




      {/* 🔥 MAIN GRID */}
        <div className=" space-y-6">


                    {/* Image selection section */}
                    <div className="items-center m-4">

                          <div>
                      
                              {/* Profile card */}
                              <Card className="overflow-hidden rounded-2xl border shadow-sm ">

                                {/* Hero banner */}
                                {/* <div className="relative h-80 overflow-hidden border-4 border-orange-500 p-2 rounded-md"> */}
                                <div className="h-80 overflow-auto m-2 rounded-md bg-muted flex items-center justify-center">
                                  {previewBanner ? (
                                        <ImagePreview src={previewBanner}>
                                          <img
                                            src={previewBanner || EmptyStateImage.src}
                                            alt="Profile Banner"
                                            // className="w-full h-full object-cover object-center"
                                            className="w-full h-full"
                                          />
                                        </ImagePreview>  
                                    ): (
                                       <div className="flex justify-center">
                                         <ImageIcon className=" p-2 w-50 h-50 rounded-full opacity-50"/>
                                       </div>
                                     )
                                   }                                   

                                </div>

                                
                                {/* BANNDER UPLOAD/REMOVE */}
                                  <div className="w-fit gap-3 ml-auto pr-2">
                                    
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Button 
                                          type="button"
                                            className="rounded-full" 
                                            variant="secondary"
                                            onClick={handleBannerUploadClick}
                                            >
                                              <Pen className="size-4 text-orange-500" />
                                          </Button>
                                      </TooltipTrigger>

                                      <TooltipContent>
                                        <p>Change banner image</p>
                                      </TooltipContent>
                                    </Tooltip>


                                          <input
                                            ref={bannerRef}
                                            type="file"
                                            onChange={handleBannerChange}
                                            className="hidden"
                                          />


                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Button 
                                          className="rounded-full" 
                                          onClick={handleRemoveBanner}
                                          variant="destructive"
                                        >
                                            <CircleMinus  className="size-4 text-orange-500" />
                                        </Button>
                                      </TooltipTrigger>

                                      <TooltipContent>
                                        <p>Remove banner image</p>
                                      </TooltipContent>
                                    </Tooltip>

                                </div>
                      
                                <div className="px-5 pt-0 pb-0">
                                  {/* Logo + edit */}
                                  {/* <div className="items-center justify-center text-center mx-auto -mt-22 mb-3 w-fit"> */}
                                  <div className="items-center justify-center text-center mx-auto mb-3 w-fit">

                                    <div className="rounded-full flex items-center justify-center shadow-sm shrink-0">
                                      {previewImage ?
                                        (
                                          <ImagePreview src={previewImage}>
                                            <Image
                                              src={previewImage || EmptyStateImage}
                                              height={100}
                                              width={100}
                                              alt="Profile Image"
                                              className="object-cover object-center rounded-full w-30 h-30 border-4 border-orange-500 rounded-full"
                                              />
                                          </ImagePreview>
                        
                                        )
                                        :
                                        (
                                          // <div className="z-99 justify-center">
                                          <div className="justify-center">
                                            <User className="text-orange-600 p-2 border-4 border-orange-600 w-30 h-30 rounded-full" />
                                          </div>
                                      )}
                                    </div>

                                  </div>


                                    <div className="w-fit mx-auto gap-3">
                                      <Button 
                                        type="button"
                                          className="rounded-none" 
                                          variant="secondary"
                                          onClick={handleUploadClick}
                                          >
                                          Upload
                                        </Button>
                                          <input
                                            ref={fileRef}
                                            type="file"
                                            onChange={handleImageChange}
                                            className="hidden"
                                          />
                                        <Button 
                                          className="rounded-none" 
                                          onClick={handleRemoveImage}
                                          variant="destructive"
                                        >
                                          Remove
                                        </Button>
                                    </div>


                                  {/* User Info Display */}
                                              <div className="my-3 w-fit mx-auto text-center">
                                                <p className="text-lg mt-2 truncate max-w-90 text-center mx-auto">
                                                  {authUser?.fullName || "User Name"}
                                                </p>
                                                <p className="text-xs text-muted-foreground my-3 flex gap-2 items-center justify-center text-center">
                                                  <AtSign className="size-4 text-orange-500" />
                                                  {authUser?.email || "user email"}
                                                </p>
                                                <p className="text-xs text-muted-foreground my-3 flex gap-2 items-center justify-center text-center">
                                                  <Location className="size-4 text-orange-500" />
                                                  {authUser?.location || "Location"}
                                                </p>
                                              </div>


                      
                                  {/* Social icons */}           
                                  <TooltipProvider>
                            <div className="flex items-center gap-4 my-6 justify-center">
                              {socials.map(({ name, icon: Icon, href, color }) => {

                                const social = socialLinks[href as keyof typeof socialLinks];
                                if (!social.visible || !social.url.trim()) return null;
                      
                                return (
                                  <Tooltip key={name}>
                                    <TooltipTrigger asChild>
                                      <motion.div
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                      >
                                        <Link
                                          href={social.url || "#"}
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

                    </div>


              
              {/* USER INFO DISPLAYING */}
              <Card className="border m-4 rounded-2xl">
                <CardContent className="p-4 space-y-4">


                  <div className="mt-10">
                    <Label >
                      <AtSign className="size-4 text-orange-500" />
                      Email Address (Read-only)
                    </Label>
                    <Input
                      disabled
                      className="rounded-none my-2"
                      value={authUser?.email}
                      placeholder="something@gmail.com"
                    />
                  </div>

                  <div className="flex gap-6">

                    <div className="flex-1">
                      <Label>
                        <Pen className="size-4 text-orange-500" />
                        Name
                      </Label>
                      <Input 
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                          }}
                          placeholder="Your name here..."
                          className="rounded-none my-2 w-full"
                      />
                    </div>


                    <div className="flex-1">
                      <Label>
                        <CircleSmall className="size-4 text-orange-500" />
                        Gender
                      </Label>

                      <Select
                        value={gender}
                        onValueChange={(value) =>
                          setGender(value as "male" | "female" | "other")
                        }
                      >
                        <SelectTrigger className="rounded-none my-2 w-full">
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="male">
                            <div className="flex items-center gap-2">
                              <Mars className="size-4 text-blue-500" />
                              Male
                            </div>
                          </SelectItem>

                          <SelectItem value="female">
                            <div className="flex items-center gap-2">
                              <Venus className="size-4 text-pink-500" />
                              Female
                            </div>
                          </SelectItem>

                          <SelectItem value="other">
                            <div className="flex items-center gap-2">
                              <CircleSmall className="size-4 text-purple-500" />
                              Other
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>  


                  </div>

                  <div>
                    <Label>
                      <Info className="size-4 text-orange-500" />
                      Bio
                    </Label>
                    <Input 
                        value={about}
                        onChange={(e) => {
                          setAbout(e.target.value);
                        }}
                        placeholder="About you..." 
                        className="rounded-none my-2"
                    />
                  </div>


                  <div>
                    <Label className="mb-2">Country</Label>
                      <DropdownMenuCheckboxes 
                        value={location}
                        onChange={setLocation}
                      />

                  </div>


<div className="space-y-6 mt-12">
  <div>
    <h2 className="text-2xl font-bold">Social Links</h2>
    <p className="text-sm text-muted-foreground mt-1">
      Add the social profiles you want to display. Toggle the
      field to hide it from your public profile.
    </p>
  </div>

  <div className="grid gap-4 md:grid-cols-2">
    {socials.map(({ name, icon: Icon, href, color }) => {

      const social = socialLinks[href as keyof typeof socialLinks];

      const url = social?.url ?? "";
      const visible = social?.visible ?? true;

      const connected = url.trim().length > 0;

      return (
        <motion.div
          key={href}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-5 border transition-all hover:border-primary hover:shadow-lg">

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${connected ? color : "text-muted-foreground"}`}
                >
                  <Icon className="size-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{name}</h3>

                  <p className="text-xs text-muted-foreground">
                    {connected
                      ? "Visible on your profile"
                      : "Not added"}
                  </p>
                </div>
              </div>


              <Badge
                className={cn(
                  connected
                    ? visible
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                    : ""
                )}
                variant={connected ? "default" : "secondary"}
              >
                {!connected
                  ? "Optional"
                  : visible
                  ? "Visible"
                  : "Hidden"}
              </Badge>


            </div>


            <Input
              className="mt-5"
              placeholder={`https://${href}.com/username`}
              value={url}
              onChange={(e) =>
                setSocialLinks((prev) => ({
                  ...prev,
                  [href]: {
                    ...prev[href as keyof typeof prev],
                    url: e.target.value,
                  },
                }))
              }
            />


            <div className="mt-5 flex items-center justify-between rounded-lg border bg-muted/40 p-3">
            <div>
              <p className="text-sm font-medium">Display on profile</p>
              <p className="text-xs text-muted-foreground">
                {visible
                  ? "This social will be shown publicly."
                  : "Keep this social hidden."}
              </p>
            </div>

            <Switch
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-orange-500"
              disabled={!connected}
              checked={visible}
              onCheckedChange={(checked) =>
                setSocialLinks((prev) => ({
                  ...prev,
                  [href]: {
                    ...prev[href as keyof typeof prev],
                    visible: checked,
                  },
                }))
              }
            />
          </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {connected
                ? "Clear this field to remove it from your public profile."
                : "Add your profile URL to display it publicly."}
            </p>
          </Card>
        </motion.div>
      );
    })}
  </div>


</div>
                  
                </CardContent>
              </Card>

        </div>




      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-6 py-4 mt-10">
          <h1 className="text-2xl font-semibold">
            Apperance
          </h1>
      </div>


      {/* 🔥 MAIN GRID */}
    <div className="shadow-2xl m-4 p-6 bg-card rounded-2xl">
      {/* Heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Theme Selection
        </p>
      </div>

      {/* Cards */}
      <div className="gap-6 w-full flex">
        
        {themes.map((themeOption) => {
          const active = theme === themeOption.id;

          return (
            <motion.button
              key={themeOption.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(themeOption.id)}              
              className="text-left w-full"
            >
              <Card
                className={cn(
                  "group relative overflow-hidden rounded-2xl bg-transparent p-3 transition-all duration-300 ",
                  active
                    ? "border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.25)]"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                {/* Glow */}
                {active && (
                  <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 rounded-2xl bg-violet-500/5"
                  />
                )}

                {/* Preview */}
                <div
                  className={cn(
                    "relative h-42.5 overflow-hidden rounded-xl border p-4 transition-all duration-300",
                    themeOption.id === "light"
                      ? "border-zinc-200 bg-[#F5F5F7]"
                      : "border-white/10 bg-[#11172A]"
                  )}
                >
                  {/* Top bar */}
                  <div className="space-y-2">
                    <Skeleton
                      className={cn(
                        "h-3 w-32 rounded-full",
                        themeOption.id === "light"
                          ? "bg-zinc-300"
                          : "bg-white/10"
                      )}
                    />

                    <Skeleton
                      className={cn(
                        "h-16 w-full rounded-xl",
                        themeOption.id === "light"
                          ? "bg-zinc-200"
                          : "bg-white/5"
                      )}
                    />
                  </div>

                  {/* Bottom cards */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <Skeleton
                        key={item}
                        className={cn(
                          "h-10 rounded-lg",
                          themeOption.id === "light"
                            ? "bg-zinc-200"
                            : "bg-white/5"
                        )}
                      />
                    ))}
                  </div>

                  {/* Selected Indicator */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-violet-400 bg-violet-500 shadow-lg shadow-violet-500/40">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between px-1">
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                    )}
                  >
                    {themeOption.title}
                  </span>

                  {/* Radio */}
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300",
                      active
                        ? "border-violet-500"
                        : "border-zinc-600 group-hover:border-zinc-400"
                    )}
                  >
                    <div
                      className={cn(
                        "h-2.5 w-2.5 rounded-full transition-all duration-300",
                        active ? "bg-violet-500" : "bg-transparent"
                      )}
                    />
                  </div>
                </div>
              </Card>
            </motion.button>
          );
        })}
      </div>
    </div>

    </div>
    
  );
}