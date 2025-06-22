import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(request: Request) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return new NextResponse("Gemini API key is not configured.", { status: 500 });
  }

  if (!request.body) {
    return new NextResponse("No image data found in the request.", { status: 400 });
  }
  const imageBuffer = await streamToBuffer(request.body);

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  // Use the new, recommended model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Identify the food in this image. Respond with only the name of the food and nothing else. For example: 'A bowl of oatmeal with blueberries' or 'Two scrambled eggs and a piece of toast'.";
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType: "image/jpeg",
    },
  };

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    return new NextResponse(text, { status: 200 });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return new NextResponse("An error occurred during AI analysis.", { status: 500 });
  }
}