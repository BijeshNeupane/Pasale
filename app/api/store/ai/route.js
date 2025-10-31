import authSeller from "@/app/middlewares/authSeller";
import { openai } from "@/configs/openai";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function main(base64Image, mimeType) {
  const messages = [
    {
      "role": "system",
      "content": `
        You are a product listing assistant for an e-commerce store.
        Your job is to analyze an image of a product and generate structured data.

        Respond ONLY with raw JSON (no code block, no markdown, no explanation).
        The JSON must strictly follow this schema:

        {
        "name": string,              // Short product name
        "description": string,       // Marketing-friendly description of the product
        }
    `,
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this image and return name + description.",
        },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
  });

  const raw = response.choices[0].message.content;

  // remove ````json` or ``` wrapper if present
  const cleaned = raw.replace(/```json|```/g, "").trim();

  let parsed;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new Error("AI did not return valid JSON.");
  }

  return parsed;
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { base64Image, mimeType } = await request.json();

    const result = await main(base64Image, mimeType);

    return NextResponse.json({ ...result }, { status: 200 });
  } catch (error) {
    console.error("Error in AI route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
