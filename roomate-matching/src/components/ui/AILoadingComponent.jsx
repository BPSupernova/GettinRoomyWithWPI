import React, { useState, useEffect } from 'react';
import './AILoadingComponent.css';

const AILoadingComponent = ({ message }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ai-loading-container">
            <div className="ai-loading-content">
                <div className="ai-brain">
                    <div className="brain-pulse"></div>
                    <div className="brain-circuits">
                        <div className="circuit circuit-1"></div>
                        <div className="circuit circuit-2"></div>
                        <div className="circuit circuit-3"></div>
                    </div>
                    <div className="ai-icon">🤖</div>
                </div>
                <h2 className="loading-title">AI Computing{dots}</h2>
                <p className="loading-message">{message || 'Finding your perfect roommate matches'}</p>
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
                <div className="loading-stats">
                    <div className="stat">
                        <span className="stat-icon">🧠</span>
                        <span>Analyzing compatibility</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">⚡</span>
                        <span>Processing preferences</span>
                    </div>
                    <div className="stat">
                        <span className="stat-icon">🎯</span>
                        <span>Ranking candidates</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AILoadingComponent;