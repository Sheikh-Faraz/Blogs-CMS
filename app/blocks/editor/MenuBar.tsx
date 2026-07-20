// "use client";

// import { Editor } from "@tiptap/core";
// import { useEditorState } from "@tiptap/react";
// import { menuBarStateSelector } from "./menuBarState";
// import { Button } from "@/components/ui/button";


// export function MenuBar({ editor }: { editor: Editor | null }) {
//   const editorState = useEditorState({
//     editor,
//     selector: menuBarStateSelector,
//   });

//   if (!editor || !editorState) return null;


//   const btn = (label: string, onClick: () => void, active?: boolean, disabled?: boolean) => (
//     <Button
//     //   onClick={onClick}
//     //   disabled={disabled}
//     //   className={`px-2 py-1 border rounded text-sm ${
//     //     active ? "bg-black text-white" : "bg-white"
//     //   } disabled:opacity-50`}
//     >
//       {label}
//     </Button>
//     // <button
//     //   onClick={onClick}
//     //   disabled={disabled}
//     //   className={`px-2 py-1 border rounded text-sm ${
//     //     active ? "bg-black text-white" : "bg-white"
//     //   } disabled:opacity-50`}
//     // >
//     //   {label}
//     // </button>
//   );

//   return (
//     <div className="flex flex-wrap gap-2">
//       {btn("Bold", () => editor.chain().focus().toggleBold().run(), editorState.isBold, !editorState.canBold)}
//       {btn("Italic", () => editor.chain().focus().toggleItalic().run(), editorState.isItalic, !editorState.canItalic)}
//       {btn("Strike", () => editor.chain().focus().toggleStrike().run(), editorState.isStrike, !editorState.canStrike)}
//       {btn("Code", () => editor.chain().focus().toggleCode().run(), editorState.isCode, !editorState.canCode)}

//       {btn("H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editorState.isHeading1)}
//       {btn("H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editorState.isHeading2)}

//       {btn("Bullet", () => editor.chain().focus().toggleBulletList().run(), editorState.isBulletList)}
//       {btn("Ordered", () => editor.chain().focus().toggleOrderedList().run(), editorState.isOrderedList)}

//       {btn("Code Block", () => editor.chain().focus().toggleCodeBlock().run(), editorState.isCodeBlock)}
//       {btn("Quote", () => editor.chain().focus().toggleBlockquote().run(), editorState.isBlockquote)}

//       {btn("Undo", () => editor.chain().focus().undo().run(), false, !editorState.canUndo)}
//       {btn("Redo", () => editor.chain().focus().redo().run(), false, !editorState.canRedo)}
//     </div>
//   );
// }



"use client";

import { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { menuBarStateSelector } from "./menuBarState";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  FileCode,
} from "lucide-react";

import React from "react";


// ✅ Move OUTSIDE
function ToolbarButton({
  icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            // variant={active ? "default" : "ghost"}
            variant={active ? "secondary" : "ghost"} // 👈 key change
            onClick={onClick}
            disabled={disabled}
            // className={cn("h-9 w-9", active && "ring-2 ring-primary")}
            className={cn(
                "h-9 w-9 text-foreground", // 👈 adapts automatically (light/dark)
                active && "bg-muted text-foreground ring-1 ring-border"
            )}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ✅ Move OUTSIDE
// function Divider() {
//   return <div className="w-px h-6 bg-border mx-1" />;
// }

export function MenuBar({ editor }: { editor: Editor | null }) {
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  if (!editor || !editorState) return null;

  return (
    // <div className="flex flex-wrap items-center gap-1 p-2 border rounded-lg bg-background">
    <div className="flex items-center gap-1 p-2 border rounded-t-lg bg-transparent w-full">
      
      {/* Text Formatting */}
      <ToolbarButton
        icon={<Bold size={16} />}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editorState.isBold}
        disabled={!editorState.canBold}
      />
      <ToolbarButton
        icon={<Italic size={16} />}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editorState.isItalic}
        disabled={!editorState.canItalic}
      />
      <ToolbarButton
        icon={<Strikethrough size={16} />}
        label="Strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editorState.isStrike}
        disabled={!editorState.canStrike}
      />
      <ToolbarButton
        icon={<Code size={16} />}
        label="Inline Code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editorState.isCode}
        disabled={!editorState.canCode}
      />

      {/* <Divider /> */}
      <Separator orientation="vertical" />

      {/* Headings */}
      <ToolbarButton
        icon={<Heading1 size={16} />}
        label="Heading 1"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editorState.isHeading1}
      />
      <ToolbarButton
        icon={<Heading2 size={16} />}
        label="Heading 2"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editorState.isHeading2}
      />

      {/* <Divider /> */}
      <Separator orientation="vertical" />

      {/* Lists */}
      <ToolbarButton
        icon={<List size={16} />}
        label="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editorState.isBulletList}
      />
      <ToolbarButton
        icon={<ListOrdered size={16} />}
        label="Ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editorState.isOrderedList}
      />

      {/* <Divider /> */}
      <Separator orientation="vertical" />

      {/* Blocks */}
      <ToolbarButton
        icon={<FileCode size={16} />}
        label="Code Block"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editorState.isCodeBlock}
      />
      <ToolbarButton
        icon={<Quote size={16} />}
        label="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editorState.isBlockquote}
      />

      {/* <Divider /> */}
      <Separator orientation="vertical" />

      {/* History */}
      <ToolbarButton
        icon={<Undo size={16} />}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
      />
      <ToolbarButton
        icon={<Redo size={16} />}
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
      />
    </div>
  );
}