"use client";

import { LoginForm } from "@/components/login-form"

// Dark & Light mode theme switcher
import { ThemeToggle } from "@/app/blocks/theme-toggle";

// Icons
import { RiPenNibLine } from "react-icons/ri";


export default function LogInPage() {
  
  return (
    // {/* <div className="h-screen border border-red-600"> */}
    <div className="min-h-screen relative">
    
      <div className="absolute right-4 top-4"> 
        <ThemeToggle />
      </div>

      <div className="min-h-screen flex flex-col gap-4 p-6 md:p-10 justify-center items-center h-full">
        
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              <RiPenNibLine className="size-5! text-[#E85129]" />
            </div>
              Inkwell.
          </a>
        </div>


          {/* <div className="w-full max-w-xs border border-blue-600"> */}
          <div className="w-full">
            <LoginForm />
          </div>

      </div>
    
    </div>
  )
}
