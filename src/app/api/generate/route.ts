// Import `GoogleGenerative` from the package we installed earlier.
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import env from "env-var";

// Create an asynchronous function POST to handle POST request.
export async function POST(req: Request) {
  // Removed res parameter as it's not needed
  try {
    // Access your API key by creating an instance of GoogleGenerativeAI
    const geminiKey = env.get("GEMINI_API_KEY").required().asString();
    console.log(geminiKey);

    const genAI = new GoogleGenerativeAI(geminiKey);

    // // Initialize a generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Retrieve the data we receive as part of the request body
    const data = await req.json();
    console.log(data);

    // Ensure the prompt is defined
    const prompt = data.prompt; // Adjust based on how the data is structured

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Pass the prompt to the model and retrieve the output
    const result = await model.generateContent(prompt);
    const response = await result.response; // Ensure result.response is valid
    const output = await response.text();

    console.log(output);

    // Send the LLM output as a server response object
    return NextResponse.json({ output: output });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    ); // Return an error response
  }
}
