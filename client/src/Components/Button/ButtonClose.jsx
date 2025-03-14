import React from 'react'
import { useLocation } from 'react-router-dom'
import './Button.css'

import close from '../../Assets/svg/close.svg'
import closeStart from '../../Assets/svg/closeWhite.svg'

export default function ButtonClose() {
    const location = useLocation()
  return (
    <button className='close' onClick={() => window.Telegram.WebApp.close()}>
        <img src={location.pathname === '/' ? closeStart : close} alt="Закрыть" />
    </button>
  )
}
