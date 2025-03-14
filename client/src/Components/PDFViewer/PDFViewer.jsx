import { useState, useEffect } from 'react';
import left from '../../Assets/svg/left.svg';
import right from '../../Assets/svg/right.svg';
import './PDFViewer.css';

export default function PDFViewer({ pdf_list }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [isPressedLeft, setisPressedLeft] = useState(false);
    const [isPressedRight, setisPressedRight] = useState(false);


    // Анимация перехода
    useEffect(() => {
        setFade(true);
        const timer = setTimeout(() => setFade(false), 300);
        return () => clearTimeout(timer);
    }, [currentIndex]);

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentIndex < pdf_list.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handleMouseDownLeft = () => setisPressedLeft(true); 
    const handleMouseUpLeft = () => setisPressedLeft(false);  
    const handleTouchStartLeft = () => setisPressedLeft(true); 
    const handleTouchEndLeft = () => setisPressedLeft(false);

    const handleMouseDownRight = () => setisPressedRight(true); 
    const handleMouseUpRight = () => setisPressedRight(false);  
    const handleTouchStartRight = () => setisPressedRight(true); 
    const handleTouchEndRight = () => setisPressedRight(false);

    return (
        <div className='pdfContainer'>
            <div className={`pdfSlide ${fade ? 'fade' : ''}`}>
                <img
                    src={pdf_list[currentIndex]}
                    alt={`page-${currentIndex + 1}`}
                    className="pdfImage"
                />
            </div>

            <div className="pdfButtons">
                {currentIndex !== 0 &&
                    <button
                        onClick={handlePrev}
                        onMouseDown={handleMouseDownLeft}    // Для десктопа
                        onMouseUp={handleMouseUpLeft}        // Для десктопа
                        onTouchStart={handleTouchStartLeft}  // Для мобильных
                        onTouchEnd={handleTouchEndLeft}
                        style={{background: isPressedLeft ? '#A799FF' : ''}}
                    >
                        <img src={left} alt="Назад" />
                    </button>
                }

                <p>{currentIndex + 1}/{pdf_list.length}</p>

                {currentIndex !== pdf_list.length - 1 && 
                    <button
                        onClick={handleNext}
                        onMouseDown={handleMouseDownRight}    // Для десктопа
                        onMouseUp={handleMouseUpRight}        // Для десктопа
                        onTouchStart={handleTouchStartRight}  // Для мобильных
                        onTouchEnd={handleTouchEndRight}
                        style={{background: isPressedRight ? '#A799FF' : ''}}
                    >
                    <img src={right} alt="Вперед" />
                </button>
                }
            </div>
        </div>
    );
};