"use client";

import { useState,
  // useEffect 
} from "react";

// Context 
import { useUser } from "@/context/User.context";

import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  // DialogClose,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  // DialogTrigger,
} from "@/components/ui/dialog"



import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"

import {
  MoreHorizontal,
  MapPin,
  User,
  BriefcaseBusiness,
  // Globe,
  // Github,
  // Linkedin,
  // Twitter,
  Camera,
} from "lucide-react";


export default function TeamCard() {

    // User Context
    // const { fetchUser, members } = useUser();
    const { members } = useUser();

    // For Profile Viewing of Team Member
    const [openProfile, setOpenProfile] = useState(false);

    type MemberUser = {
      _id: string;
      fullName: string;
      about?: string;
      email: string;
      profilePic?: string;
      location?: string;
    };
    const [selectedMember, setSelectedMember] = useState<MemberUser | null>(null);

    // useEffect(() => {
    //     fetchUser();
    // }, [])

  return (
                
    // Current Openings — proper <table> so columns never stack 
                <Card className="rounded-xl border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold">Current Members</h2>
                      {/* <button className="text-xs text-blue-500 hover:text-blue-600 font-medium">View All</button> */}
                    </div>
        
        
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-xs">
                        <thead>
                          {/* <tr className="border-b border-border"> */}
                          <tr className="border-b border-border bg-muted">
                            {["Member", "Role", "Status", "Email", "Location", ""].map((h) => (
                              <th key={h} className="text-left text-muted-foreground font-medium py-2 px-4 last:pr-0 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {members.map((member) => {
                            // const s = statusConfig[member.status];
                            return (
                              <tr key={member.user._id}>
        
                                <td className="py-3 pr-4 font-medium whitespace-nowrap flex items-center gap-3">
                                    <img
                                        src={member.user.profilePic} 
                                        alt={`${member.user.fullName}'s profile picture`} 
                                        className="w-10 h-10 rounded-full object-cover mr-2 border border-white" 
                                    />
        
                                    <span>
                                        {member.user.fullName}
                                    </span>
                                </td>
        
                                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{member.role}</td>
                                <td className="py-3 pr-4">
                                  {/* <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} border ${s.border} font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap`}> */}
                                  <span className={`inline-flex items-center gap-1.5 bg-green-600 border font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap`}>
                                    {/* <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} /> */}
                                        Active
                                  </span>
                                </td>
                                <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">{member.user.email}</td>
                                <td className="py-3 pr-4">
                                  <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    {member.user.location}
                                  </div>
                                </td>
                                <td className="py-3">

                                  {/* <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"> */}
                                    {/* <MoreHorizontal className="w-4 h-4" /> */}

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <MoreHorizontal className="w-4 h-4" />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                          <DropdownMenuLabel>
                                            <Button 
                                              variant="outline" 
                                              onClick={() => {setOpenProfile(true) 
                                                setSelectedMember(member.user)}
                                              }
                                            >
                                              View Profile
                                            </Button>
                                          </DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                  {/* </button> */}
         {/* ------------------------------------------------------------------------------------------------------------- */}



         <Dialog open={openProfile} onOpenChange={setOpenProfile}>
  {/* <DialogContent className="max-w-4xl p-0 overflow-hidden"> */}
  <DialogContent className="max-w-4xl! p-0 overflow-auto h-150">
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="relative h-32 bg-linear-to-r from-primary/20 via-primary/10 to-background border-b">
        <div className="absolute inset-0 bg-grid-white/[0.03]" />

        <div className="absolute -bottom-12 left-8">
          <div className="relative">
            {/* <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={member.user.profilePic} />
              <AvatarFallback>JC</AvatarFallback>
            </Avatar> */}

             {/* Glow Layer */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-125" />

            <Avatar className="relative h-24 w-24 border border-white/10 bg-background/40 backdrop-blur-xl shadow-xl">
              <AvatarImage src={member.user.profilePic} />
              <AvatarFallback>JC</AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-16 px-8 pb-8 space-y-8">
        {/* Name */}
        <div>
          <h2 className="text-2xl font-bold">{member.user.fullName}</h2>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">
              @{member.user.fullName}
            </Badge>

            <Badge variant="outline">
              Open Source
            </Badge>

            <Badge variant="outline">
              Developer
            </Badge>
          </div>
        </div>

        {/* About */}
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
                About
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {member.user.about}
            </p>
          </CardContent>
        </Card>

        {/* Work + Location */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="group transition-all hover:shadow-md hover:border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" />
                Work
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  Position
                </p>

                <p className="font-medium">
                  Senior Software Engineer
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Company
                </p>

                <p className="font-medium">
                  Acme Inc
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-md hover:border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="font-medium">
                {member.user.location || "Location not specified"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {/* <Globe className="h-4 w-4" /> */}
              Social Presence
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  // icon: Globe,
                  icon: User,
                  label: "Website",
                  value: "jordanchen.dev",
                },
                {
                  // icon: Twitter,
                  icon: User,
                  label: "X",
                  value: "@jordanchen",
                },
                {
                  // icon: Linkedin,
                  icon: User,
                  label: "LinkedIn",
                  value: "/in/jordanchen",
                },
                {
                  // icon: Github,
                  icon: User,
                  label: "GitHub",
                  value: "jordanchen",
                },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{
                    y: -2,
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl border bg-muted/20 cursor-pointer"
                >
                  <item.icon className="h-5 w-5 text-primary" />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>

                    <p className="font-medium">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpenProfile(false)}
          >
            Close
          </Button>

          {/* <Button>
            Save Changes
          </Button> */}
        </div>
      </div>
    </motion.div>
  </DialogContent>
</Dialog>



                                  

                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
        
                  </CardContent>
                </Card>

      );
};