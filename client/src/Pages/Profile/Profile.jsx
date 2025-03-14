import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Selecter from '../../Components/Selecter/Selecter';
import Button from '../../Components/Button/Button';
import ButtonEdit from '../../Components/Button/ButtonEdit';
import axios from 'axios';

import settings from '../../Assets/svg/settings.svg';
import right from '../../Assets/svg/right.svg';
import close from '../../Assets/svg/close.svg';
import zamer from '../../Assets/img/zamer.jpeg';
import chart from '../../Assets/svg/chart.svg';
import img from '../../Assets/img/result.jpg';
import edit from '../../Assets/svg/editSmall.svg';

// Вспомогательный компонент для редактирования фото
const PhotoEditor = ({ label, initialPhoto }) => {
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(initialPhoto);

  // Обработчик клика по ButtonEdit
  const handleEditClick = () => {
    fileInputRef.current?.click(); // Активируем скрытый input
  };

  // Обработчик выбора нового фото
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file); // Добавляем фото в FormData

      try {
        // Отправляем фото на сервер
        await axios.post('API_URL_PHOTO', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPhoto(URL.createObjectURL(file)); // Обновляем фото на клиенте
        console.log(`${label} успешно обновлено!`);
      } catch (error) {
        console.error(`Ошибка при загрузке ${label}:`, error);
      }
    }
  };

  return (
    <div className="before">
      <span>{label}</span>
      <div className="forBefore">
        <img src={photo} alt={label} />
        <div className="forEdit">
          <ButtonEdit
            icon={edit}
            size={30}
            sizeIcon={16}
            onClick={handleEditClick} // Клик по кнопке вызывает выбор файла
          />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }} // Скрываем input
        onChange={handleFileChange} // Как только выбрали файл, отправляем его
      />
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
          if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.setBackgroundColor('#F2F2F2')
          }
        }, []);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);

  const handleSelecterClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="profilePage">
      <div className="profileContainer">
        {data ? (
          <div className="profile" style={{ justifyContent: 'space-between' }}>
            <div className="profileData">
              <ProfileBtn />
              <div className="profileName">
                <p>name</p>
                <span>level</span>
              </div>
            </div>
            <ButtonEdit onClick={() => navigate('/parameters')} />
          </div>
        ) : (
          <div className="profile">
            <ProfileBtn />
            <div className="profileName">
              <p>name</p>
              <span>level</span>
            </div>
          </div>
        )}
        <div className="settings">
          <div className="set" onClick={() => setOpen(!open)}>
            <img src={settings} alt="Настройки" />
            <p>Настроить уровень сложности</p>
            <img
              className="toggle"
              src={right}
              style={{ opacity: open ? '0' : '1' }}
              alt="Настроить уровень сложности"
            />
            <img
              className="toggle"
              src={close}
              style={{ opacity: open ? '1' : '0' }}
              alt="Настроить уровень сложности"
            />
          </div>
          {open && (
            <Selecter
              bg="#fff"
              activeIndex={activeIndex}
              textOne="Новичок"
              textTwo="Профи"
              onClick={handleSelecterClick}
            />
          )}
        </div>
        {data ? (
          <div className="dataHave">
            <div className="recordText">
              <h4>Запись прогресса</h4>
              <p>Чтобы отслеживать прогресс необходимо в конце каждой недели обновлять параметры.</p>
            </div>
            <button
              className="recordBtn"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => navigate('/record')}
              style={{ background: isPressed ? '#C0C0C0' : '', borderColor: isPressed ? '#C0C0C0' : '' }}
            >
              <img src={chart} alt="Записать прогресс" />
              <p>Записать прогресс</p>
            </button>
            <div className="parameters">
              <h3>Параметры</h3>
              <div className="parametersValues">
                <div className="param">
                  <div className="value">
                    <span>Возраст</span>
                    <p>29</p>
                  </div>
                  <div className="value">
                    <span>Пол</span>
                    <p>Женский</p>
                  </div>
                </div>
                <div className="param">
                  <div className="value">
                    <span>Обхват груди</span>
                    <p>90</p>
                  </div>
                  <div className="value">
                    <span>Обхват талии</span>
                    <p>60</p>
                  </div>
                </div>
                <div className="param">
                  <div className="value">
                    <span>Обхват живота</span>
                    <p>60</p>
                  </div>
                  <div className="value">
                    <span>Обхват бедер</span>
                    <p>90</p>
                  </div>
                </div>
                <div className="param">
                  <div className="value">
                    <span>Обхват ноги</span>
                    <p>40</p>
                  </div>
                  <div className="value">
                    <span>Вес</span>
                    <p>56</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="photosContainerBefore">
              <h3>Фотографии</h3>
              <p>До и после тренировочной недели</p>
              <div className="photosBefore">
                <PhotoEditor label="Фото до" initialPhoto={img} />
                <PhotoEditor label="Фото после" initialPhoto={img} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="zamer">
              <img src={zamer} alt="Важность замеров" />
            </div>
            <div className="profileInfo">
              <h4>Почему важно сделать фото и замеры?</h4>
              <p>Полагаться только на весы нет смысла. (советую взвешиваться не чаще чем раз в неделю на программе).</p>
              <div style={{ padding: '8px 16px', background: '#CEC8FF', borderRadius: '14px' }}>
                <p>Вес может скакать изо дня в день, особенно если вы начинаете ходить в зал. Это нормально.</p>
              </div>
              <p>Также помним, что один и тот же вес будет смотреться на разных девушках по-разному! Все зависит от соотношения жира и мышц в организме.</p>
              <div style={{ padding: '8px 16px', background: '#E6FFAD', borderRadius: '14px' }}>
                <p>Поэтому ни с кем себя не сравниваем! Сравниваем только с собой из вчера!</p>
              </div>
            </div>
          </>
        )}
        {!data && (
          <Button
            onClick={() => navigate('/parameters')}
            text="Добавить параметры"
            bg="#A799FF"
            bgFocus="#776CBC"
            color="#F2F2F2"
          />
        )}
      </div>
    </div>
  );
}