import React from 'react'
import './Progress.css'

export default function Progress({ title, count_all, count_complited, purple }) {
  return (
    <div className='progressContainer'>
        <div className="progressInfo">
            <div className="progressTitle">{title}</div>
            <div className="progressCount">{count_complited}/{count_all}</div>
        </div>
        <progress className={`progress ${purple ? 'purple' : ''}`} value={count_complited} max={count_all} />
    </div>
  )
}
