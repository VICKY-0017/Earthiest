import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from 'dotenv';
import fs from "fs";

config();

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

// Turn images to Part objects
const filePart1 = fileToGenerativePart("download.jpeg", "image/jpeg")
// const filePart2 = fileToGenerativePart("piranha.jpg", "image/jpeg")
// const filePart3 = fileToGenerativePart("firefighter.jpg", "image/jpeg")

async function run() {
  // Choose a Gemini model.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = "Is the sapling is grounded?";

  const imageParts = [
    filePart1,
    // filePart2,
    // filePart3,
  ];

  const generatedContent = await model.generateContent([prompt, ...imageParts]);
  
  console.log(generatedContent.response.text());
}

run();