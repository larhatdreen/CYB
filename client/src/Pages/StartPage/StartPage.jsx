import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; 
import './StartPage.css';

import Button from '../../Components/Button/Button';
import ImageOverlay from '../../Components/ImageOverley';

import startPhoto from '../../Assets/img/start.jpg';
import element from '../../Assets/img/element.png'
import run from '../../Assets/svg/run.svg';

export default function StartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.setBackgroundColor('#fff')
    }
  }, []);

  const handleButtonClick = useCallback(async () => {
    const userId = window.Telegram.WebApp.initDataUnsafe.user?.id;
    if (!userId) {
      console.error('User ID не доступен');
      navigate('/quiz');
      return;
    }
    // try {

    //   const response = await axios.get(
    //     `/get_difficulty?user_id=${userId}`,
    //     {
    //       headers: { 'Content-Type': 'application/json' },
    //     }
    //   );

    //   const { difficulty } = response.data;
    //   console.log(response.data)

    //   if (difficulty === null || difficulty === undefined) {
    //     navigate('/quiz');
    //   } else {
    //     navigate('/dashboard');
    //   }
    // } catch (error) {
    //   console.error('Ошибка при запросе к бэкенду:', error);
    // }

    // console.log('Button clicked!');
    navigate('/quiz')
  }, [navigate]);

  return (
    <div className="startPage">
      <div className="imgContainer">
        <img className='green' src={element} alt="Зеленый фон" />
        <ImageOverlay
          overlayImageSrc={startPhoto}
          maskImageSrc={element}
        />
      </div>
      <div className="startDown">
        <div className="startPadding">
          <div className="startText">
            <h1>
              CREATE<br />YOUR <span>BODY</span>
            </h1>
            <p>Построй тело своей мечты</p>
          </div>
          <Button
            onClick={handleButtonClick}
            bgFocus="#A799FF"
            icon={run}
            text={'Начать'}
          />
        </div>
      </div>
    </div>
  );
}