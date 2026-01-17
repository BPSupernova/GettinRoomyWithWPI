import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import './CardContainer.css'; // We'll add some basic styling next

const db = [
    { name: 'Richard Hendricks', img: '...' },
    { name: 'Erlich Bachman', img: '...' },
    { name: 'Monica Hall', img: '...' },
    { name: 'Jared Dunn', img: '...' },
    { name: 'Dinesh Chugtai', img: '...' }
];

function CardContainer() {
    const [characters] = useState(db);
    const cardRefs = useRef(characters.map(() => React.createRef())); // For programmatic control

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
        if (cardRefs.current[activeCardIndex]) {
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
                        preventSwipe={['up', 'down']} // Optional: Only allow left/right swipes
                    >
                        <div
                            style={{ backgroundImage: `url(${character.img})` }}
                            className="card"
                        >
                            <h3>{character.name}</h3>
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
