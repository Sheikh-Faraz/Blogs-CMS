"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation";
import { FormEvent } from "react";


// Context
import { useUser } from "@/context/User.context";

// Notifications
import { toast } from "react-hot-toast";

// UI Blocks
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { Spinner } from "@/components/ui/spinner"

// Icons
import { Eye, EyeOff, UserRound, Mail, Lock, MailPlus} from "lucide-react"



// import { GoogleLogin } from "@react-oauth/google";

// export function SignUpForm({
function SignUpFormContent({
  className,
  ...props
}: React.ComponentProps<"form">) {


  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;

  // const invitedEmail = searchParams.get("email");

  const invitationToken = searchParams.get("invitationToken");
  const invitedEmail = searchParams.get("invitationEmail");
  const isInvitationFlow = !!invitationToken;


  const { signup, isSigningUp } = useUser();

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });


  // Set the email from the url and don't allow the user to change the email as it could be not the same as 
  // to the one it is intended for 
  useEffect(() => {

    if (invitedEmail) {

      setFormData((prev) => ({
        ...prev,
        email: invitedEmail,
      }));

    }
  }, [invitedEmail]);


  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const success = validateForm();

    if (success === true) {
      signup(formData, redirectTo);
    };

  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
    
    {/* <div className="flex flex-row-reverse w-fit mx-auto gap-5"> */}
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 sm:px-6 lg:flex-row-reverse lg:items-start lg:justify-center">

      {isInvitationFlow && (
        <div className="w-full min-w-0 rounded-xl bg-card text-card-foreground lg:max-w-sm">
          <div className="p-4 text-center text-sm sm:p-5">

            <MailPlus className="mx-auto my-4 size-10 text-[#E85129] sm:size-12" />

            <p className="font-medium">
              Workspace invitation
            </p>

            <p className="mt-1 text-muted-foreground">
              Log in to continue with your invitation.
            </p>

            {invitedEmail && (
              <p className="mt-2 break-all text-xs text-muted-foreground">
                Invitation for:
                <span className="ml-1 text-[#E85129]">
                  {invitedEmail}
                </span>
              </p>
            )}

            <div className="mt-4 text-center text-sm">
              <a
                href="/signup"
                className="text-muted-foreground underline underline-offset-4 hover:text-[#E85129]"
              >
                Cancel invitation
              </a>
            </div>

          </div>
        </div>
      )}

          {/* {isInvitationFlow && (
                <div className="rounded-xl bg-card text-card-foreground flex items-center justify-center text-center">
                    <div className="p-4 text-sm text-center">
                     
                      <MailPlus className="mx-auto size-12 text-[#E85129] my-4"/>  
          
                      <p className="font-medium">
                        Workspace invitation
                      </p>
          
                      <p className="mt-1 text-muted-foreground">
                        Log in to continue with your
                        invitation.
                      </p>
          
                      {invitedEmail && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Invitation for:  <span className="text-[#E85129] ml-1">{invitedEmail}</span> 
                        </p>
                      )}
          
          
                      {isInvitationFlow && (
                        <div className="text-center text-sm mt-4">
                          <a
                            href="/signup"
                            className="text-muted-foreground underline underline-offset-4 hover:text-[#E85129]"
                          >
                            Cancel invitation
                          </a>
                        </div>
                      )}
          
                    </div>
                </div>
              )} */}
        {/* </div> */}


    {/* <div className="bg-card text-card-foreground p-8 rounded-xl"> */}
    <div className="w-full min-w-0 rounded-xl bg-card p-5 text-card-foreground sm:p-8 lg:max-w-md">
    
      <div className="flex flex-col items-center gap-2 text-center m-2">

        <h1 className="text-2xl font-bold">Create an account</h1>
      </div>

      {/* <div className="grid gap-6 max-[425px]:gap-8"> */}
      <div className="grid gap-6">
        
        {/* Name */}
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>

            <InputGroup>
              <InputGroupInput 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                value={formData.fullName}
                disabled={isSigningUp}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />

                <InputGroupAddon >
                  <UserRound size={18}/>
                </InputGroupAddon>

            </InputGroup>
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>

          <InputGroup>
          <InputGroupInput 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              required 
              disabled={isSigningUp || !!invitedEmail}
              value={invitedEmail || formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value,})}
          />

            <InputGroupAddon >
                <Mail size={18}/>
            </InputGroupAddon>

            </InputGroup>

        </div>

        {/* Password */}
        <div className="grid gap-3">
            <Label htmlFor="password">Password</Label> 
            
        <InputGroup>
          <InputGroupInput 
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="**********"
            required
            value={formData.password}
            disabled={isSigningUp}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

            <InputGroupAddon >
              <Lock size={18} />
            </InputGroupAddon>

            <InputGroupAddon align="inline-end">

            <Tooltip>
                <TooltipTrigger asChild>
            <InputGroupButton
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </InputGroupButton>

              </TooltipTrigger>
                <TooltipContent>
                  <p>{showPassword ? "Hide Password" : "Show Password" }</p>
                </TooltipContent>
              </Tooltip>

              </InputGroupAddon>
            </InputGroup>
                <p className=" text-[12px]">Password must be at least 6 characters</p>
          </div>


        <Button type="submit" className="w-full bg-[#E85129] hover:bg-[#F06A48] text-white" disabled={isSigningUp}>
          {isSigningUp ? (
            <Spinner className="mx-auto" />
            ): (
              <span>
                Sign Up
              </span>
            )}  
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or
          </span>
        </div>

        {/* Social button */}
        {/* <GoogleLogin
          onSuccess={googleLogin}
          onError={() => console.log("Login Failed")}
        /> */}
        
        
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        {/* <a href="/login" className="underline underline-offset-4 hover:text-green-600">
          Login
        </a> */}

        <a
          href={
            isInvitationFlow
              ? `/login?invitationToken=${encodeURIComponent(
                  invitationToken!
                )}&invitationEmail=${encodeURIComponent(
                  invitedEmail || ""
                )}&redirect=${encodeURIComponent(
                  redirectTo || ""
                )}`
              : "/login"
          }
          className="underline underline-offset-4 hover:text-[#E85129]"
        >
          Login
        </a>



      </div>
  
    </div>

    </div>
    </form>
  )
}


export function SignUpForm(
  props: React.ComponentProps<"form">
) {
  return (
    <Suspense fallback={null}>
      <SignUpFormContent {...props} />
    </Suspense>
  );
}