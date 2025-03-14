import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Container.css'

import lock from '../../Assets/svg/lock.svg'

export default function Containers({ data }) {
  const navigate = useNavigate()
  return (
    <div 
      className={`container ${data.closed !== null || data.buy ? 'disabled' : ''}`} 
      style={{background: data.instruction ? '#D3CCFF' : '', 
              borderColor: data.instruction ? '#D3CCFF' : ''
      }}
      onClick={() => navigate(`/${data.to}`)}
      >
        <div className="nameContainer">
          <img src={data.icon} alt={data.name} />
          <h2>{data.name}</h2>
        </div>
        {data.closed && 
          <div className='containerClosed'>Откроется {data.closed}</div>
        }
        {data.buy &&
          <button className='containerBuy' disabled={data.buy}>
            <img src={lock} alt="Купить" />
            Купить
          </button>
        }
    </div>
  )
}
