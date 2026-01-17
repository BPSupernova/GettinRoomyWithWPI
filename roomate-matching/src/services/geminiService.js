// 🔮 Gemini API Integration Service
// This file communicates with the backend server

const API_BASE_URL = "http://localhost:3001";

export async function fetchRankedProfiles(userPrefs, candidateProfiles) {
    const response = await fetch(`${API_BASE_URL}/rank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userPrefs,
            candidates: candidateProfiles
        })
    });

    if (!response.ok) throw new Error("Ranking failed");
    return response.json(); // returns array of {score, reason, profile}
}