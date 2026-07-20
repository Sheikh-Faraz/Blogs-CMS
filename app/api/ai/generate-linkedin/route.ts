import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-flash",
    // });

    const prompt = `
Convert the following blog into a LinkedIn post.

Rules:
- Max 120 words
- Strong hook at start
- Add emojis
- Add 3–5 hashtags
- Make it engaging and human

Blog:
${content}
`;

    // const result = await model.generateContent(prompt);
    // const response = await result.response;

    const response = await genAI.models.generateContent({
        // model: "gemini-1.5-flash",
        model: "gemini-3-flash-preview",
        contents: prompt,
    });

    const text = response.text || "No content generated OR ERROR in generation";

    return NextResponse.json({ post: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}