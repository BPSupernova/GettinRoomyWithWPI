import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/match", async (req, res) => {
    const { userPrefs, candidate } = req.body;

    const prompt = `
You are a roommate compatibility expert.

User preferences:
${JSON.stringify(userPrefs)}

Candidate profile:
${JSON.stringify(candidate)}

Score compatibility from 1 to 10.
Return JSON only:
{ "score": number, "reason": string }
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
    });

    res.json(JSON.parse(response.text));
});

app.listen(3001, () =>
    console.log("Gemini matcher running on port 3001")
);
