import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { fetchRankedProfiles } from '@/services/geminiService';
import './CardContainer.css'; // We'll add some basic styling next

const db = [
    { name: 'Richard Hendricks', email: 'richard@example.com', age: 26, bio: 'Aspiring entrepreneur and coder.', interests: 'Hiking, Coding, Music', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Richard_I_of_England.png/250px-Richard_I_of_England.png' },
    { name: 'Monica Hall', email: 'monica@example.com', age: 28, bio: 'Software engineer and fitness enthusiast.', interests: 'Fitness, Coding, Travel', img: 'https://upload.wikimedia.org/wikipedia/en/0/04/Monica_%28Monica%27s_Gang%29.png' },
    { name: 'Jared Dunn', email: 'jared@example.com', age: 30, bio: 'Data analyst and tech enthusiast.', interests: 'Data Analysis, Tech, Reading', img: 'https://cdn.pen.org/wp-content/uploads/2024/05/22211134/Jared-Jackson-e1576537497162.jpg' },
]

function CardContainer({ user }) {
    const [characters, setCharacters] = useState([]);
    const cardRefs = useRef([]); // For programmatic control

    // Fetch ranked profiles from backend (Gemini) using user's prefs
    useEffect(() => {
        let mounted = true;
        async function loadRanked() {
            try {
                if (user) {
                    const ranked = await fetchRankedProfiles(user, db);
                    if (!mounted) return;
                    setCharacters(ranked.map(r => r.profile));
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
            }
        }
        loadRanked();
        return () => { mounted = false; };
    }, [user]);

    const onSwipe = (direction, nameToDelete) => {
        console.log('You swiped ' + direction + ' on ' + nameToDelete);
        // Here you would likely remove the swiped item from your state
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
                        <div
                            style={{ backgroundImage: `url(${character.img})` }}
                            className="card"
                        >
                            <h3>{character.name}</h3>
                            <p>{character.bio}</p>
                            <p>Age: {character.age}</p>
                            <p>Interests: {character.interests}</p>
                        </div>
                    </TinderCard>
                ))}
            </div>
            {/* Buttons for programmatic swiping */}
            <div className="buttons">
                <button onClick={() => swipe('left')}>Swipe Left</button>
                <button onClick={() => swipe('right')}>Swipe Right</button>
            </div>
        </div>
    );
}

export default CardContainer;
