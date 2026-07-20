import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        {
          error: "Please enter a blog title first.",
        },
        {
          status: 400,
        }
      );
    }

    const prompt = `
      You are an expert technical blog writer.

      Write a complete, high-quality blog article about:

      "${title}"

      Requirements:

      - Return VALID HTML ONLY.
      - Do NOT return markdown.
      - Do NOT wrap the output in \`\`\`.
      - Do NOT include <html>, <head> or <body>.
      - Begin directly with the article content.

      Structure:
      - One engaging introduction.
      - Multiple logical sections.
      - Use <h2> for main sections.
      - Use <h3> where appropriate.
      - Use <p> for paragraphs.
      - Use <ul> and <ol> where appropriate.
      - Use <blockquote> only if useful.
      - Use <pre><code> only when code examples are relevant.
      - End with a meaningful conclusion.

      Writing Style:
      - Professional.
      - Clear.
      - Engaging.
      - SEO friendly.
      - Human sounding.
      - Avoid fluff.
      - Avoid repeating ideas.


      If the topic is programming:
      - Include practical examples.
      - Include code snippets inside:
      <pre><code>...</code></pre>

      - Explain the code.
      - Add best practices.
      - Add common mistakes.
      - Add a short FAQ.

      
      HTML Rules:
      - Return clean semantic HTML only.
      - Do not include inline CSS.
      - Do not include JavaScript.
      - Do not include markdown.
      - Do not include explanations.
      - Do not include comments.

      Return ONLY the HTML.
    `;

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
      { error: String(error) },
      { status: 500 }
    );
  }
}