import React, { useState, useEffect } from 'react';
import './Begin.css';

import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Selecter from '../../Components/Selecter/Selecter';
import PDFViewer from '../../Components/PDFViewer/PDFViewer';
import VideoPage from '../../Components/VideoPage/VideoPage';

import health from '../../Assets/svg/health.svg';
import begin from '../../Assets/video/begin.mp4'

export default function Begin({ userId }) {
  const [videoView, setVideoView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(videoView ? 1 : 0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.setBackgroundColor('#F2F2F2');
    }

    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error('Не удалось получить Telegram ID');
        const response = await axios.get(`${API_BASE_URL}/api/v1/user`, {
          params: { user_id: userId },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  // Автоматический импорт всех изображений begin*
  const importAll = (context) => context.keys().map(context);
  const pdfList = importAll(
    require.context('../../Assets/pdf/begin/', false, /begin_pdf_\d+\.(jpe?g)$/)
  );

  // const handleSelect = (index) => {
  //   setActiveIndex(index);
  //   setVideoView(index === 1);
  // };


  return (
    <div className="beginPage">
      <div className="topBegin">
        <ProfileBtn level={userData.user_level} user_photo={userData.image} />
        <div className="beginTitle">
          <img src={health} alt="Введение" />
          <h1>Введение</h1>
        </div>
      </div>
      <div className="botBegin">
        {/* <Selecter
          onClick={handleSelect}
          textOne="Подготовка"
          textTwo="Видео"
          activeIndex={activeIndex}
        /> */}
        {!videoView ?
            <PDFViewer pdf_list={pdfList} />
            :
            <VideoPage video={begin} page='/begin' userId={userId} />
        }
      </div>
    </div>
  );
}