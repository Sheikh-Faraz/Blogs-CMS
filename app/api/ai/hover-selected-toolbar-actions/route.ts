import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});



function serializeBlocks(blocks: any[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
        case "heading":
        case "bulletListItem":
        case "numberedListItem":
        case "checkListItem":
        case "quote":
        case "codeBlock":
          return {
            ...block,
            content:
              block.content
                ?.map((c: any) => c.text ?? "")
                .join("") ?? "",
          };

        default:
          // Preserve every other block exactly
          return block;
      }
    });
}



export async function POST(req: Request) {
  try {
    const { action, selectedText, } = await req.json();

    if (!selectedText?.length) {
        return NextResponse.json(
            {
            error: "No selection found.",
            },
            {
            status: 400,
            }
        );
    }


    const blocks = serializeBlocks(selectedText);


    let prompt = "";

    switch (action) {
        

        case "expand":

          prompt = `

            You are editing BlockNote editor blocks.

            Selected BlockNote JSON:
            ${JSON.stringify(blocks, null, 2)}

            Task:
            Expand ONLY textual content.

            
            Rules:
            - Return ONLY valid JSON.
            - Return the SAME array.
            - Preserve every block id.
            - Preserve every block type.
            - Preserve every props object.
            - Preserve every children array.
            - Preserve every image, audio, video, file, table, embed, divider and code block exactly.
            - Modify ONLY textual content.
            - Never remove blocks.
            - Never add blocks.
            - Never change block order
            `;

        break;

        case "shorten":

          prompt = `

            You are editing BlockNote editor blocks.

            Selected BlockNote JSON:
            ${JSON.stringify(blocks, null, 2)}

            Task:
            Shorten ONLY textual content.

            Rules:
            - Return ONLY valid JSON.
            - Return the SAME array.
            - Preserve every block id.
            - Preserve every block type.
            - Preserve every props object.
            - Preserve every children array.
            - Preserve every image, audio, video, file, table, embed, divider and code block exactly.
            - Modify ONLY textual content.
            - Never remove blocks.
            - Never add blocks.
            - Never change block order
            `;

        break;


        case "grammar":

          prompt = `

            You are editing BlockNote editor blocks.

            Selected BlockNote JSON:
            ${JSON.stringify(blocks, null, 2)}

            Task:
            Correct the grammar of ONLY textual content.

            Rules:
            - Return ONLY valid JSON.
            - Return the SAME array.
            - Preserve every block id.
            - Preserve every block type.
            - Preserve every props object.
            - Preserve every children array.
            - Preserve every image, audio, video, file, table, embed, divider and code block exactly.
            - Modify ONLY textual content.
            - Never remove blocks.
            - Never add blocks.
            - Never change block order
            `;

        break;

        
        case "improve":

            prompt = `

                You are editing BlockNote editor blocks.

                Selected BlockNote JSON:
                ${JSON.stringify(blocks, null, 2)}

                Task:
                Improve ONLY textual content.


                Rules:
                - Return ONLY valid JSON.
                - Return the SAME array.
                - Preserve every block id.
                - Preserve every block type.
                - Preserve every props object.
                - Preserve every children array.
                - Preserve every image, audio, video, file, table, embed, divider and code block exactly.
                - Modify ONLY textual content.
                - Never remove blocks.
                - Never add blocks.
                - Never change block order
                `;

        break;



        case "professional":

            prompt = `

              You are editing BlockNote editor blocks.

              Selected BlockNote JSON:
              ${JSON.stringify(blocks, null, 2)}

              Task:
              Rewrite the following in a professional tone. ONLY textual content.

                Rules:
                - Return ONLY valid JSON.
                - Return the SAME array.
                - Preserve every block id.
                - Preserve every block type.
                - Preserve every props object.
                - Preserve every children array.
                - Preserve every image, audio, video, file, table, embed, divider and code block exactly.
                - Modify ONLY textual content.
                - Never remove blocks.
                - Never add blocks.
                - Never change block order
              `;

        break;



        default:

            return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
            );
    }


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });


    if (!response.text) {
    return NextResponse.json(
        { error: "AI returned an empty response." },
        { status: 500 }
    );
    }

    const clean = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

    const parsed = JSON.parse(clean);

    return NextResponse.json({
    blocks: parsed,
    });


  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}