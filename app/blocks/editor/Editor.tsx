"use client";

import { useEffect, useRef } from "react";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

import FormattingToolbarWithAI from "./FormattingToolbarWithAI";



export default function Editor({
  value,
  setEditor,
  markModified,
  // loadingAction,
  // setLoadingAction,
}: {
  value: any;
  setEditor?: any;
  markModified?: () => void;
  // onChange: any;
  // loadingAction: string | null;
  // setLoadingAction: React.Dispatch<
  //   React.SetStateAction<string | null>
  // >;
}) {

  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch("/api/blogpost/editorUploadMedia", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "File upload failed");
      }

      return data.url;
    },
  });


  
  const hasInitialized = useRef(false);

  useEffect(() => {
    setEditor?.(editor);
  }, [editor, setEditor]);


  useEffect(() => {
    async function loadInitialContent() {
      // Already initialized with actual content
      if (hasInitialized.current) return;

      // Wait if there is no content yet
      if (!value) return;

      // Old HTML string content
      if (typeof value === "string") {
        if (!value.trim()) return;

        const blocks =
          await editor.tryParseHTMLToBlocks(value);

        editor.replaceBlocks(
          editor.document,
          blocks
        );

        hasInitialized.current = true;
      }

      // New BlockNote array content
      else if (
        Array.isArray(value) &&
        value.length > 0
      ) {
        editor.replaceBlocks(
          editor.document,
          value
        );

        hasInitialized.current = true;
      }
    }

    loadInitialContent();
  }, [editor, value]);

  // useEffect(() => {
  //   async function loadInitialContent() {
  //     // Only load once
  //     if (hasInitialized.current) return;

  //     if (!value) {
  //       hasInitialized.current = true;
  //       return;
  //     }

  //     if (typeof value === "string") {
  //       const blocks = await editor.tryParseHTMLToBlocks(value);

  //       editor.replaceBlocks(editor.document, blocks);
  //     } else if (Array.isArray(value)) {
  //       editor.replaceBlocks(editor.document, value);
  //     }

  //     hasInitialized.current = true;
  //   }

  //   loadInitialContent();
  // }, [editor]);


  useEffect(() => {
    return editor.onChange(() => {
      markModified?.();
    });
  }, [editor, markModified]);

  return (
    <div className="border">

      <BlockNoteView
        editor={editor}
        formattingToolbar={false}
        className="my-blocknote overflow-auto h-screen"
      >

        <FormattingToolbarWithAI
          editor={editor}
          // loadingAction={loadingAction}
          // setLoadingAction={setLoadingAction}
        />

      </BlockNoteView>

    </div>
  );
}