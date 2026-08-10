"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex gap-2">

      <Button 
        variant="outline" 
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4 text-[#E85129]" />
      </Button>

      <Button 
        variant="outline" 
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4 text-[#E85129]" />
      </Button>

    </div>
  );
}