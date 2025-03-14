import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileBtn.css'

import avatar from '../../Assets/nav/user.svg'

export default function ProfileBtn() {
  const navigate = useNavigate()
  const [userPhoto, setUserPhoto] = useState(null)
  return (
    <button className='profileBtn' onClick={() => navigate('/profile')}>
        <img src={userPhoto ? userPhoto : avatar} alt="аватар" style={{transform: userPhoto ? '' : 'scale(0.7)'}}/>
        <div className="profileEllips"></div>
    </button>
  )
}
