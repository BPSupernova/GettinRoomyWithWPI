import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { fetchRankedProfiles } from '@/services/geminiService';
import AILoadingComponent from '@/components/ui/AILoadingComponent';
import './CardContainer.css';

const db = [
    { name: 'Richard Hendricks', email: 'richard@example.com', age: 26, bio: 'Aspiring entrepreneur and coder.', interests: 'Hiking, Coding, Music', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Richard_I_of_England.png/250px-Richard_I_of_England.png' },
    { name: 'Monica Hall', email: 'monica@example.com', age: 28, bio: 'Software engineer and fitness enthusiast.', interests: 'Fitness, Coding, Travel', img: 'https://upload.wikimedia.org/wikipedia/en/0/04/Monica_%28Monica%27s_Gang%29.png' },
    { name: 'Jared Dunn', email: 'jared@example.com', age: 30, bio: 'Data analyst and tech enthusiast.', interests: 'Data Analysis, Tech, Reading', img: 'https://cdn.pen.org/wp-content/uploads/2024/05/22211134/Jared-Jackson-e1576537497162.jpg' },
    // { name: 'Alex Bun', email: 'alex@example.com', age: 25, bio: 'Creative and fun-loving.', interests: 'Art, Music, Travel', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH7YMk0RiwflYdOC1p_Mgi7e3yica4sbYOhQ&s' }
]

function CardContainer({ user }) {
    const [characters, setCharacters] = useState([]);
    const [matches, setMatches] = useState([]); // Store successful matches
    const [showResults, setShowResults] = useState(false); // Show results table when done
    const [isLoading, setIsLoading] = useState(true); // Loading state for AI matching
    const cardRefs = useRef([]); // For programmatic control

    // Fetch ranked profiles from backend (Gemini) using user's prefs
    useEffect(() => {
        let mounted = true;
        async function loadRanked() {
            try {
                setIsLoading(true);
                if (user) {
                    const ranked = await fetchRankedProfiles(user, db);
                    if (!mounted) return;
                    setCharacters(ranked.map(r => ({ ...r.profile, score: r.score, reason: r.reason })));
                    cardRefs.current = ranked.map(() => React.createRef());
                } else {
                    // No user yet: show default list
                    setCharacters(db);
                    cardRefs.current = db.map(() => React.createRef());
                }
            } catch (err) {
                console.error('Failed to fetch ranked profiles:', err);
                setCharacters(db);
                cardRefs.current = db.map(() => React.createRef());
            } finally {
                if (mounted) setIsLoading(false);
            }
        }
        loadRanked();
        return () => { mounted = false; };
    }, [user]);

    // Add keyboard support for arrow keys
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Only handle arrow keys if we're not in an input field and have cards to swipe
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Only allow swiping if there are cards available and not showing results
            if (characters.length === 0 || showResults || isLoading) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                swipe('left');
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                swipe('right');
            }
        };

        // Add event listener
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [characters.length, showResults, isLoading]); // Dependencies to ensure we have the latest state

    const onSwipe = (direction, characterToSwipe) => {
        console.log('You swiped ' + direction + ' on ' + characterToSwipe);

        // Find the full character object
        const character = characters.find(char => char.name === characterToSwipe);

        // Apply final decision logic
        const aiThreshold = 6; // AI score threshold for approval - just an example
        const aiApproved = character.score >= aiThreshold;
        const userApproved = direction === 'right';

        // User makes the ultimate call on match
        if (userApproved) {
            const matchData = {
                ...character,
                userChoice: 'Yes',
                matchedAt: new Date().toLocaleString()
            };
            setMatches(prev => [...prev, matchData]);
            console.log(`Match! ${character.name} (Score: ${character.score})`);
        }

        // Remove card from stack
        setCharacters(prev => {
            const newCharacters = prev.filter(char => char.name !== characterToSwipe);
            // If no more cards, show results
            if (newCharacters.length === 0) {
                setShowResults(true);
            }
            return newCharacters;
        });

        console.log(`Decision: AI(${character.score}≥${aiThreshold})=${aiApproved}, User(${direction})=${userApproved}`);
    };

    const onCardLeftScreen = (name) => {
        console.log(name + ' left the screen!');
    };

    // Optional: Function to control the swipe with buttons
    const swipe = async (dir) => {
        // Get the index of the last active card to swipe it
        const activeCardIndex = characters.length - 1;
        if (cardRefs.current[activeCardIndex]?.current) {
            await cardRefs.current[activeCardIndex].current.swipe(dir); // Swipe the card programmatically
        }
    };

    // Sort matches by AI score (highest first)
    const sortedMatches = [...matches].sort((a, b) => b.score - a.score);

    // Show loading screen while AI is computing
    if (isLoading) {
        return <AILoadingComponent message="🔍 Finding your perfect roommate matches using AI..." />;
    }

    if (showResults) {
        return (
            <div className="results-container">
                <h2>🎉 Your Roommate Matches!</h2>
                {matches.length === 0 ? (
                    <p>No matches found. Try adjusting your preferences or swiping right more often!</p>
                ) : (
                    <div className="matches-table-container">
                        <table className="matches-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Email</th>
                                    <th>AI Score</th>
                                    <th>Your Choice</th>
                                    <th>Interests</th>
                                    <th>Bio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMatches.map((match, index) => (
                                    <tr key={match.name} className="match-row">
                                        <td><strong>{match.name}</strong></td>
                                        <td>{match.age}</td>
                                        <td><a href={`mailto:${match.email}`}>{match.email}</a></td>
                                        <td><span className="score">{match.score}/10</span></td>
                                        <td><span className="choice-yes">✅ {match.userChoice}</span></td>
                                        <td>{match.interests}</td>
                                        <td>{match.bio}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="results-summary">
                            <p><strong>Total Matches: {matches.length}</strong></p>
                            <p>Reach out via email to connect with your potential roommates!</p>
                        </div>
                    </div>
                )}
                <button
                    className="start-over-btn"
                    onClick={() => {
                        setShowResults(false);
                        setMatches([]);
                        // Reload characters if needed
                        window.location.reload();
                    }}
                >
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="cardContainer">
                {characters.map((character, index) => (
                    <TinderCard
                        ref={cardRefs.current[index]}
                        className="swipe"
                        key={character.name}
                        onSwipe={(dir) => onSwipe(dir, character.name)}
                        onCardLeftScreen={() => onCardLeftScreen(character.name)}
                        preventSwipe={['up', 'down']}
                    >
                        <div className="card">
                            <div
                                className="card-image"
                                style={{ backgroundImage: `url(${character.img})` }}
                            >
                                <div className="card-overlay">
                                    <h3 className="card-name">{character.name}</h3>
                                    <p className="card-age">Age: {character.age}</p>
                                </div>
                            </div>
                            <div className="card-details">
                                <div className="card-info">
                                    <p className="bio">{character.bio}</p>
                                    <div className="interests">
                                        <strong>Interests:</strong> {character.interests}
                                    </div>
                                    <div className="compatibility">
                                        <div className="compatibility-score">
                                            <strong>Compatibility: {character.score || "N/A"}</strong>
                                        </div>
                                        {character.reason && (
                                            <div className="compatibility-reason">
                                                <em>{character.reason}</em>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TinderCard>
                ))}
            </div>
            <br />
            <br />
            <div className="buttons">
                <p>💡 <strong>Pro tip:</strong> Use ← and → arrow keys to swipe!</p>
                <div className="button-group">
                    <button onClick={() => swipe('left')}>
                        ❌ Pass
                    </button>
                    <button onClick={() => swipe('right')}>
                        ❤️ Like
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardContainer;
