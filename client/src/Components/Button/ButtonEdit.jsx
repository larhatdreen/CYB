import React, { useState } from 'react'

import edit from '../../Assets/svg/edit.svg'

export default function ButtonEdit({ onClick, icon, size, sizeIcon }) {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = (e) => {
        if (onClick) onClick(e); // Вызываем переданный обработчик
      };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleTouchStart = () => setIsPressed(true);
    const handleTouchEnd = () => setIsPressed(false);
    return (
        <button
            className='edit'
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ 
                background: isPressed ? '#C0C0C0' : '', 
                borderColor: isPressed ? '#C0C0C0' : '',
                width: size ? size : '',
                height: size ? size : '',
            }}
        >
            <img 
                src={icon ? icon : edit} 
                alt="Изменить" 
                style={{
                    width: sizeIcon ? sizeIcon : '',
                    height: sizeIcon ? sizeIcon : '',
                }} 
            />
        </button>
    )
}
