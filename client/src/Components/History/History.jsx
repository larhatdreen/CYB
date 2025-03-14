import React from 'react'
import './History.css'

import play from '../../Assets/svg/play.svg'

export default function History({ text, viewed = 10, view = 35, instruction = false }) {
  return (
    <div 
        className='historyContainer'
        style={{background: instruction ? '#FAFAFA' : '', border: instruction ? '1px solid #e6e6e6' : ''}}
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
            style={{background: instruction ? '#E4E1FB' : ''}}
        >
            <p>{view-viewed} мин</p>
            <button 
                className='historyPlay' 
                style={{background: instruction ? '#A799FF' : ''}}>
                <img src={play} alt="Продолжить просмотр" />
            </button>
        </div>
    </div>
  )
}
