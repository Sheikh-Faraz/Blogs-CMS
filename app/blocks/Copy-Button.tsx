"use client";

import { useState } from "react";

// Icon
import { Copy, Check } from "lucide-react";

// Notifications
import { toast } from "react-hot-toast";

// UI Blocks
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export default function CopyButton({
  value,
  label = "Copy",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(true);
      toast.success(`Copied to clipboard`);
    //   toast.success(`${label} copied to clipboard`);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
    //   console.error("Failed to copy:", error);
      toast.error(`Failed to copy:  ${error}`);
    //   toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-none", className)}
          onClick={handleCopy}
        >

            {/* <span className="flex size-4 items-center justify-center"> */}
                {copied ? (
                    <Check className="size-4" />
                    ) : (
                        <Copy className="size-4" />
                )} 
            {/* </span> */}

        </Button>
      </TooltipTrigger>

      <TooltipContent>
        {copied ? "Copied!" : label}
      </TooltipContent>
    </Tooltip>
  );
};

