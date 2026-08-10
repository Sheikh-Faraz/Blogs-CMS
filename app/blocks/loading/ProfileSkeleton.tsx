import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
} from "@/components/ui/card";


// Icons
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

export default function ProfileSkeleton() {
  return (
    <div className="overflow-hidden"> 

    {/* 🔥 HEADER */}
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <Skeleton className="h-9 w-28" />
      </div>

      <Skeleton className="h-10 w-32 rounded-none" />
    </div>



    {/* Image selection section */}
<div className="items-center m-4">
  <div>
    {/* Profile card */}
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      
      {/* Hero banner skeleton */}
      <div className="h-80 overflow-hidden m-2 rounded-md">
        <Skeleton className="w-full h-full rounded-md" />
      </div>

      {/* Banner buttons skeleton */}
      <div className="w-fit flex gap-3 ml-auto pr-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      <div className="px-5 pt-0 pb-0">

        {/* Profile image skeleton */}
        <div className="items-center justify-center text-center mx-auto mb-3 w-fit">
          <div className="rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Skeleton className="w-30 h-30 rounded-full" />
          </div>
        </div>

        {/* Upload / Remove buttons skeleton */}
        <div className="w-fit mx-auto flex gap-3">
          <Skeleton className="h-10 w-20 rounded-none" />
          <Skeleton className="h-10 w-20 rounded-none" />
        </div>

        {/* User info skeleton */}
        <div className="my-3 w-fit mx-auto text-center">
          <Skeleton className="h-6 w-32 mx-auto mt-2" />

          <div className="my-3 flex gap-2 items-center justify-center">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>

          <div className="my-3 flex gap-2 items-center justify-center">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Social icons skeleton */}
        <div className="flex items-center gap-4 my-6 justify-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        <Separator />

      </div>
    </Card>
  </div>
</div>



{/* USER INFO DISPLAYING */}
<Card className="border m-4 rounded-2xl">
  <CardContent className="p-4 space-y-4">

    {/* Email */}
    <div className="mt-10">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-10 w-full rounded-none my-2" />
    </div>

    {/* Name + Gender */}
    <div className="flex gap-6">

      <div className="flex-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full rounded-none my-2" />
      </div>

      <div className="flex-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-10 w-full rounded-none my-2" />
      </div>

    </div>

    {/* Bio */}
    <div>
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-10 w-full rounded-none my-2" />
    </div>

    {/* Country */}
    <div>
      <Skeleton className="h-5 w-20 mb-2" />
      <Skeleton className="h-10 w-full rounded-none" />
    </div>

  </CardContent>
</Card>




{/* USER INFO DISPLAYING  */}
<Card className="border m-4 rounded-2xl">
  <CardContent className="p-4 space-y-4">

    {/* Email */}
    <div className="mt-10">
      <Skeleton className="h-5 w-40 mb-2" />
      <Skeleton className="h-10 w-full rounded-none" />
    </div>

    {/* Name + Gender */}
    <div className="flex gap-6">

      <div className="flex-1">
        <Skeleton className="h-5 w-20 mb-2" />
        <Skeleton className="h-10 w-full rounded-none" />
      </div>

      <div className="flex-1">
        <Skeleton className="h-5 w-24 mb-2" />
        <Skeleton className="h-10 w-full rounded-none" />
      </div>

    </div>

    {/* Bio */}
    <div>
      <Skeleton className="h-5 w-16 mb-2" />
      <Skeleton className="h-10 w-full rounded-none" />
    </div>

    {/* Country */}
    <div>
      <Skeleton className="h-5 w-20 mb-2" />
      <Skeleton className="h-10 w-full rounded-none" />
    </div>

  </CardContent>
</Card>


{/* SOCIAL LINKS SKELETON */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">

  {socials.map(({ href }) => (
    <Card
      key={href}
      className="p-5 border"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">

          {/* Social icon */}
          <Skeleton className="h-11 w-11 rounded-xl" />

          {/* Name + description */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>

        </div>

        {/* Badge */}
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* URL input */}
      <Skeleton className="h-10 w-full mt-5 rounded-md" />

      {/* Display on profile */}
      <div className="mt-5 flex items-center justify-between rounded-lg border bg-muted/40 p-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>

            {/* Switch */}
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          {/* Bottom description */}
          <Skeleton className="h-3 w-64 mt-2" />
        </Card>
      ))}

      </div>


      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-6 py-4 mt-10">
        <Skeleton className="h-7 w-28" />
      </div>


      {/* 🔥 MAIN GRID */}
      <div className="shadow-2xl m-4 p-6 bg-card rounded-2xl">

        {/* Heading */}
        <div className="mb-6">
          <Skeleton className="h-3 w-28" />
        </div>

        {/* Cards */}
        <div className="gap-6 w-full flex">

          {themes.map((themeOption) => (
            <div
              key={themeOption.id}
              className="text-left w-full"
            >
              <Card className="group relative overflow-hidden rounded-2xl bg-transparent p-3">
                
                {/* Preview */}
                <div className="relative h-42.5 overflow-hidden rounded-xl border p-4">
                  
                  {/* Top bar */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32 rounded-full" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>

                  {/* Bottom cards */}
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((item) => (
                      <Skeleton
                        key={item}
                        className="h-10 rounded-lg"
                      />
                    ))}
                  </div>

                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between px-1">
                  <Skeleton className="h-4 w-16" />

                  {/* Radio */}
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>

              </Card>
            </div>
          ))}

        </div>
      </div>

 
    </div>
  );
}