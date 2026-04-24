import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
console.log("Using API key:", apiKey ? apiKey.substring(0, 10) + "..." : "missing");

const genAI = new GoogleGenerativeAI(apiKey);

async function checkModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("Available models:");
    data.models.forEach(m => console.log(m.name));
  } catch (err) {
    console.error("Error:", err);
  }
}

checkModels();
