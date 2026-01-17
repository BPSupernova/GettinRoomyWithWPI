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

    if (!process.env.GEMINI_API_KEY) {
        // Fallback simple scoring if API key missing
        const fallback = candidates.map(c => ({
            profile: c,
            score: 5,
            reason: "Fallback score"
        }));
        return res.json(fallback.slice(0, 5));
    }

    try {
        const prompt = `
You are a roommate compatibility expert.

User preferences:
${JSON.stringify(userPrefs, null, 2)}

Candidates:
${JSON.stringify(candidates, null, 2)}

Instructions:
- Score EACH candidate from 1 to 10
- Provide a short reason
- Preserve candidate order
- Return JSON ONLY in this exact format:

[
  { "index": number, "score": number, "reason": string }
]
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const response = await model.generateContent(prompt);
        const text = response.response.text();

        const parsed = JSON.parse(text);

        const results = parsed.map(item => ({
            score: item.score,
            reason: item.reason,
            profile: candidates[item.index]
        }));

        results.sort((a, b) => b.score - a.score);

        res.json(results.slice(0, 5));
    } catch (err) {
        console.error("Gemini ranking failed:", err);
        res.status(500).json({ error: "Ranking failed" });
    }
});

app.listen(3001, () => console.log("Gemini ranking server running on port 3001"));
