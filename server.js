import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Test Route
app.get("/", (req, res) => {
    res.json({
        message: "Mentora AI Backend is Running!"
    });
});


// Chat Route
app.post("/chat", async (req, res) => {

    try {

        const {
            message,
            learning_level = "Beginner",
            language = "English",
            explanation_style = "Simple"
        } = req.body;


        const prompt = `
You are Mentora AI, an intelligent personalized learning assistant.

Student Preferences:

Learning Level: ${learning_level}
Language: ${language}
Explanation Style: ${explanation_style}

Your job:
- Explain clearly according to the student's learning level.
- Use simple examples when helpful.
- Help the student understand concepts.
- Be friendly and encouraging.
- If Bengali is selected, respond in Bengali.
- If Banglish is selected, respond in Banglish.

Student Question:
${message}
`;


        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt
        });


        res.json({
            response: response.text
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        res.status(500).json({
            error: "Something went wrong!",
            details: error.message
        });

    }

});


// Start Server
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`🚀 Mentora AI Backend running at http://localhost:${PORT}`);
});