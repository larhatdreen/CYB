import React from 'react'
import './VideoPage.css'

import VideoViewer from '../VideoViewer/VideoViewer'
import Button from '../Button/Button'

import check from '../../Assets/svg/check.svg'

export default function VideoPage({ video, page, userId }) {
  return (
    <div className="videoPage">
        <div className="videoInfo">
            <VideoViewer videoSrc={video} page={page} userId={userId}  />
            <p className='beginDescription'>В этом видео я расскажу как подготовиться к старту программы</p>
        </div>
        <Button width='100%' color='#0D0D0D' icon={check} text={'Начать'} bg='#CBFF52' bgFocus='#EBFFBD' />
    </div>
  )
}
