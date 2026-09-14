"use client";

import { SignUpForm } from "@/components/signup-form"

// Dark & Light mode theme switcher
import { ThemeToggle } from "@/app/blocks/theme-toggle";

// Icons
import { RiPenNibLine } from "react-icons/ri";


export default function SignUpPage() {
  return (
    <div className="min-h-screen relative">

      <div className="absolute right-4 top-4"> 
        <ThemeToggle />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center items-center h-full min-h-screen">

        <div className="flex justify-center gap-2 md:justify-start">
          <a className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              <RiPenNibLine className="size-5! text-[#E85129]" />
            </div>
              Inkwell.
          </a>
        </div>
        
          {/* <div className="w-full max-w-xs"> */}
          <div className="w-full">
            <SignUpForm />
          </div>
      
      </div>


    </div>
  )
}
