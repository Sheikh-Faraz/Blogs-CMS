"use client";

import { LoginForm } from "@/components/login-form"

import { RiPenNibLine } from "react-icons/ri";


export default function LogInPage() {
  
  return (
    <div className="h-screen">

      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center items-center h-full">
        
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              <RiPenNibLine className="size-5! text-green-600" />
            </div>
              Inkwell.
          </a>
        </div>


          {/* <div className="w-full max-w-xs border border-blue-600"> */}
          <div className="w-full">
            <LoginForm />  {/* Log-In Form */}
          </div>

      </div>
    
    </div>
  )
}
