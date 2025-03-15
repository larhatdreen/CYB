import React from 'react';
import './Selecter.css'; // Добавим стили

export default function Selecter({ bg, onClick, textOne, textTwo, activeIndex }) {

    
    return (
        <div className="selecterContainer" style={{background: bg ? bg : ''}}>
            <div className="forBackground">
                <button
                    className={`selecter ${activeIndex === 0 ? 'active' : ''}`}
                    onClick={() => onClick(0)}
                >
                    {textOne}
                </button>
                <button
                    className={`selecter ${activeIndex === 1 ? 'active' : ''}`}
                    onClick={() => onClick(1)}
                >
                    {textTwo}
                </button>
                <div
                    className="selecterBackground"
                    style={{
                        left: activeIndex === 0 ? '0' : '50%',
                    }}
                />
            </div>
        </div>
    );
}