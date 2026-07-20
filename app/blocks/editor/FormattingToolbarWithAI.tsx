"use client";

import {
  FormattingToolbar,
  FormattingToolbarController,
  getFormattingToolbarItems,
} from "@blocknote/react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import AIDropdown from "./AIDropdown";

import { InfoIcon } from "lucide-react";


export default function FormattingToolbarWithAI({
  editor,
//   loadingAction,
//   setLoadingAction,
}: {
  editor: any;
//   loadingAction: string | null;
//   setLoadingAction: React.Dispatch<
//     React.SetStateAction<string | null>
//   >;
}) {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {/* Default BlockNote buttons */}
          {getFormattingToolbarItems()}

          {/* Our AI Button */}
          <Tooltip>

            <TooltipTrigger asChild>
                <div> 
                    <AIDropdown
                        editor={editor}
                        // loadingAction={loadingAction}
                        // setLoadingAction={setLoadingAction}
                    />
                </div>
            </TooltipTrigger>

            {/* <TooltipContent>
              AI Assistant THINGY
            </TooltipContent> */}

            <TooltipContent className='max-w-64 py-3 text-pretty'>
                <div className='space-y-1'>
                    <div className='flex items-center gap-2'>
                    <p className='text-sm font-medium'>AI Assistant</p>
                    </div>
                    <div className='flex gap-2'>
                        <InfoIcon className='size-8' />
                        <p className='text-background/80'>
                            Keep your text selected. If the selection is lost, the AI result will be inserted at the cursor.
                        </p>
                    </div>
                </div>
            </TooltipContent>

          </Tooltip>

        </FormattingToolbar>
      )}
    />
  );
}