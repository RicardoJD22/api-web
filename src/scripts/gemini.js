import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function ask() {
  rl.question("Tú: ", async (input) => {
    const result = await model.generateContent(input);
    console.log("Gemini:", result.response.text());
    ask(); // sigue el chat
  });
}

ask();
