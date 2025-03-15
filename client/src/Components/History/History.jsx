import React from 'react';
import './History.css';
import { useNavigate } from 'react-router-dom';

import play from '../../Assets/svg/play.svg';

export default function History({ text, viewed = 10, view = 50, instruction = false, lastVideo }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (lastVideo) {
      navigate(`/${lastVideo}`); // Переход на страницу из last_video
    }
  };

  return (
    <div
      className='historyContainer'
      style={{
        background: instruction ? '#FAFAFA' : '',
        border: instruction ? '1px solid #e6e6e6' : '',
        cursor: lastVideo ? 'pointer' : 'default' // Курсор как ссылка, если есть lastVideo
      }}
      onClick={lastVideo ? handleClick : null} // Обработчик клика только если есть lastVideo
    >
      <div className="historyInfo">
        <p>Продолжить</p>
        <progress
          className={`historyProgress ${instruction ? 'instruction' : ''}`}
          value={viewed}
          max={view}
        />
        <span>{text}</span>
      </div>
      <div
        className="historyAction"
        style={{ background: instruction ? '#E4E1FB' : '' }}
      >
        <p>{view - viewed} мин</p>
        <button
          className='historyPlay'
          style={{ background: instruction ? '#A799FF' : '' }}
        >
          <img src={play} alt="Продолжить просмотр" />
        </button>
      </div>
    </div>
  );
}