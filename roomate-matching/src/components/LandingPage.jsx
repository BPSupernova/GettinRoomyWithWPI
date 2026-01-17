import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import "./LandingPage.css";

export default function LandingPage({ onStart }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        studentId: "",
        age: "",
        bio: "",
        interests: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Handle student ID validation
        if (name === "studentId") {
            // Only allow digits and limit to 9 characters
            const numericValue = value.replace(/\D/g, '').slice(0, 9);
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate student ID
        if (formData.studentId.length !== 9) {
            alert("Please enter a valid WPI Student ID");
            return;
        }

        // 🔮 TODO:
        // 1. Send formData to backend to create user profile
        // 2. Backend responds with success/failure
        // 3. On success, call onStart to proceed to preranking/matching
        console.log("User submitted:", formData);
        onStart(formData);
    };

    return (
        <div className="landing-container">
            {/* WPI Goat Background Elements */}
            <div className="wpi-background">
                <div className="goat-silhouette goat-1">🐐</div>
                <div className="goat-silhouette goat-2">🐐</div>
                <div className="goat-silhouette goat-3">🐐</div>
                <div className="wpi-logo-bg">WPI</div>
                <div className="building-silhouette"></div>
                <div className="tech-pattern"></div>
            </div>

            <div className="landing-content">
                <div className="landing-header">
                    <div className="wpi-branding">
                        <span className="goat-mascot">🐐</span>
                        <span className="wpi-text">WPI</span>
                    </div>
                    <h1>🏠 GettinRoomy</h1>
                    <p className="tagline">Find your perfect WPI roommate match</p>
                </div>

                <Card className="landing-card">
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="Your age"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="studentId">WPI Student ID</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
                                    placeholder="Enter your WPI Student ID"
                                    maxLength="9"
                                    pattern="[0-9]{9}"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself (habits, preferences, etc.)"
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="interests">Interests (comma-separated)</label>
                                <input
                                    type="text"
                                    id="interests"
                                    name="interests"
                                    value={formData.interests}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Gaming, Cooking, Gym"
                                />
                            </div>

                            <Button type="submit" className="submit-btn">
                                Start Matching! 🎯
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="landing-features">
                    <div className="feature">
                        <span className="feature-icon">🤖</span>
                        <h3>AI-Powered Pre-Matching</h3>
                        <p>Using Google Gemini to analyze compatibility</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">💾</span>
                        <h3>Secure Database</h3>
                        <p>Your data stored securely in MongoDB Atlas</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">❤️</span>
                        <h3>Perfect Match</h3>
                        <p>Swipe to find your ideal roommate</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
