import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


export async function POST(req: Request) {
  try {
    const { action, title, content, } = await req.json();

      const requiresContent = [
        "continue",
        "conclusion",
        "improve",
        "simplify",
        "professional",
      ];

      const plainContent = content
        ?.replace(/<[^>]*>/g, "")
        .trim();

      if (
        requiresContent.includes(action) &&
        !plainContent
      ) {
        return NextResponse.json(
          {
            error: "No content available.",
          },
          {
            status: 400,
          }
        );
      }



    let prompt = "";

    switch (action) {

        case "continue":

          prompt = `
              
            You are a professional writer.

            Title:
            ${title}

            Current article (HTML):

            ${content}

            Task:
            Continue writing the article from exactly where it ends.

            Rules:
            - Return ONLY the new HTML to append.
            - Do NOT repeat or rewrite existing content.
            - Continue naturally from the final paragraph.
            - Add headings only when appropriate.
            - Return valid HTML fragments only.
            - Use only supported tags such as:
              <h2>, <h3>, <p>, <ul>, <ol>, <li>, <blockquote>, <pre>, <code>.
            - Do NOT include <html>, <head> or <body>.
            - Do NOT wrap the output in markdown.
            - Do NOT modify any existing content.
            `;

        break;


        case "conclusion":

          prompt = `

            You are a professional writer.

            Current article (HTML):

            ${content}

            Task:
            If the article has no conclusion, append one.
            If a conclusion already exists, rewrite ONLY that conclusion.

            Rules:
            - Return the COMPLETE updated HTML.
            - Preserve the existing structure.
            - Preserve every heading.
            - Preserve every paragraph unless rewriting the conclusion.
            - Preserve every list.
            - Preserve every code block.
            - Preserve every table.
            - Preserve every blockquote.
            - Preserve every image exactly.
            - Preserve every video exactly.
            - Preserve every audio block exactly.
            - Preserve every file block exactly.
            - Preserve every embed exactly.
            - Preserve every custom HTML element exactly.
            - Never remove or relocate media.
            - Return HTML only.
            - No markdown.
            `;

        break;


      case "improve":

            prompt = `
            
                You are a professional editor.

                Title:
                ${title}

                Document (HTML):

                ${content}

                Task:
                Improve the writing quality of the document.

                Rules:
                - Return the COMPLETE HTML document.
                - Improve grammar.
                - Improve readability.
                - Improve wording.
                - Improve sentence flow.
                - Keep the same meaning.
                - Do NOT remove sections.
                - Do NOT add unrelated content.
                - Preserve every HTML element that is not textual.
                - Never remove or recreate images.
                - Never remove videos.
                - Never remove audio.
                - Never remove files.
                - Never remove embeds.
                - Never remove tables.
                - Never remove code blocks.
                - Never change the order of media.
                - Edit ONLY textual content.
                - Return HTML only.
                - No markdown.
                `;

        break;
        

        case "simplify":

            prompt = `

              You are a professional editor.

              Title:
              ${title}

              Document (HTML):

              ${content}

              Task:
              Rewrite the article using simpler language.

              Rules:
              - Return the COMPLETE HTML.
              - Keep all information.
              - Use simpler vocabulary.
              - Explain concepts more clearly.
              - Preserve every HTML element.
              - Preserve all media exactly.
              - Preserve tables.
              - Preserve code blocks.
              - Preserve embeds.
              - Edit only text.
              - Return HTML only.
              - No markdown.
              `;

        break;


        case "professional":

            prompt = `

              You are a professional editor.

              Title:
              ${title}

              Document (HTML):

              ${content}

              Task:
              Rewrite the article in a professional tone.

              Rules:
              - Return the COMPLETE HTML.
              - Keep the meaning unchanged.
              - Improve wording.
              - Improve professionalism.
              - Preserve the HTML structure.
              - Preserve every heading.
              - Preserve every paragraph.
              - Preserve every image.
              - Preserve every video.
              - Preserve every audio block.
              - Preserve every file block.
              - Preserve every embed.
              - Preserve every table.
              - Preserve every code block.
              - Preserve every custom HTML element.
              - Never remove or move media.
              - Modify ONLY textual content.
              - Return HTML only.
              - No markdown.
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

    return NextResponse.json({
      content: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}