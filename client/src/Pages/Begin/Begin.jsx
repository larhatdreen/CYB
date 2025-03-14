import React, { useState, useEffect } from 'react';
import './Begin.css';

import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Selecter from '../../Components/Selecter/Selecter';
import PDFViewer from '../../Components/PDFViewer/PDFViewer';
import VideoPage from '../../Components/VideoPage/VideoPage';

import health from '../../Assets/svg/health.svg';
import begin from '../../Assets/video/begin.mp4'

export default function Begin() {
  const [videoView, setVideoView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(videoView ? 1 : 0);

  // Автоматический импорт всех изображений begin*
  const importAll = (context) => context.keys().map(context);
  const pdfList = importAll(
    require.context('../../Assets/pdf/begin/', false, /begin_pdf_\d+\.(jpe?g)$/)
  );

  const handleSelect = (index) => {
    setActiveIndex(index);
    setVideoView(index === 1);
  };


  return (
    <div className="beginPage">
      <div className="topBegin">
        <ProfileBtn />
        <div className="beginTitle">
          <img src={health} alt="Введение" />
          <h1>Введение</h1>
        </div>
      </div>
      <div className="botBegin">
        <Selecter
          onClick={handleSelect}
          textOne="Подготовка"
          textTwo="Видео"
          activeIndex={activeIndex}
        />
        {!videoView ?
            <PDFViewer pdf_list={pdfList} />
            :
            <VideoPage video={begin} />
        }
      </div>
    </div>
  );
}