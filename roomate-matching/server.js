import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. The server will use fallback scoring.");
}

// Endpoint: Rank candidates based on user preferences
app.post("/rank", async (req, res) => {
    const { userPrefs, candidates } = req.body;

    const results = [];

    for (const candidate of candidates) {
        const prompt = `
You are a roommate compatibility expert.

User preferences:
${JSON.stringify(userPrefs)}

Candidate profile:
${JSON.stringify(candidate)}

Score compatibility from 1 to 10.
Return JSON ONLY:
{ "score": number, "reason": string }
`;

        const response = await genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }).generateContent(prompt);
        const result = await response.response;
        const text = result.text();

        try {
            const parsed = JSON.parse(text);
            results.push({
                ...parsed,
                profile: candidate
            });
        } catch (err) {
            console.error("Failed to parse Gemini response:", text);
            results.push({ score: 0, reason: "Parsing error", profile: candidate });
        }
    }

    // Sort descending by score
    results.sort((a, b) => b.score - a.score);

    // Return top N (e.g., top 5)
    res.json(results.slice(0, 5));
});

app.listen(3001, () => console.log("Gemini ranking server running on port 3001"));
