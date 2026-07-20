"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  Loader2,
  Sparkles,
  WandSparkles,
  BookOpen,
  Scissors,
  CheckCheck,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const actions = [
  {
    id: "expand",
    label: "Expand",
    icon: BookOpen,
  },
  {
    id: "shorten",
    label: "Shorten",
    icon: Scissors,
  },
  {
    id: "grammar",
    label: "Fix Grammar",
    icon: CheckCheck,
  },
  {
    id: "improve",
    label: "Improve Writing",
    icon: WandSparkles,
  },
  {
    id: "professional",
    label: "Professional Tone",
    icon: Briefcase,
  },
];

export default function AIDropdown({
  editor,
}: {
  editor: any;
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleSelectionAI = async (action: string) => {

    setLoadingAction(action);

    const selection = editor.getSelection();

    console.log("THIS IS THE SELECTION: ", selection);

    if (!selection) return;

    const document = editor.document;

    const startIndex = document.findIndex(
      (b) => b.id === selection.blocks[0].id
    );

    const endIndex = document.findIndex(
      (b) => b.id === selection.blocks.at(-1)!.id
    );

    // const selectedBlocks = document.slice(
    const selectedText = document.slice(
      startIndex,
      endIndex + 1
    );


    try {
      const res = await fetch("/api/ai/hover-selected-toolbar-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          selectedText,
        }),
      });

      if (!res.ok) {
        toast.error("AI action failed. Please try again.");
        throw new Error("AI request failed");
      }


      const data = await res.json();


      editor.replaceBlocks(
        selectedText,
        data.blocks
      );


    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>

        <div className="border-l">
            <Button
                variant="secondary"
                size="sm"
                className="gap-2 ml-2 mt-1 flex"
            >
                <Sparkles className="size-4" />
                <span className="text-sm">AI</span>
            </Button>
        </ div>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-none"
      >
        <DropdownMenuLabel>
          AI Assistant
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {actions.map(({ id, label, icon: Icon }) => (
          <DropdownMenuItem
            key={id}
            onSelect={(e) => {
              e.preventDefault();
              handleSelectionAI(id);
            }}
            disabled={loadingAction !== null}
          >
            {loadingAction === id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icon className="mr-2 h-4 w-4" />
            )}

            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}