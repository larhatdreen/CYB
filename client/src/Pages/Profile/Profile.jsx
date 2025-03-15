import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Selecter from '../../Components/Selecter/Selecter';
import Button from '../../Components/Button/Button';
import ButtonEdit from '../../Components/Button/ButtonEdit';
import axios from 'axios';
import { API_BASE_URL } from '../../API';

import settings from '../../Assets/svg/settings.svg';
import right from '../../Assets/svg/right.svg';
import close from '../../Assets/svg/close.svg';
import zamer from '../../Assets/img/zamer.jpeg';
import chart from '../../Assets/svg/chart.svg';
import img from '../../Assets/img/result.jpg';
import edit from '../../Assets/svg/editSmall.svg';

const PhotoEditor = ({ label, initialPhoto, userId, number }) => {
  const fileInputRef = useRef(null);
  const [photo, setPhoto] = useState(initialPhoto);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/user/image/two`, {
          params: { user_tg_id: userId, number },
          responseType: 'blob', // Получаем изображение как Blob
        });
        setPhoto(URL.createObjectURL(response.data));
      } catch (error) {
        console.error(`Ошибка при получении ${label}:`, error.message);
        setPhoto(initialPhoto); // Используем заглушку, если фото нет
      }
    };
    fetchPhoto();
  }, [userId, number, label, initialPhoto]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        await axios.post(`${API_BASE_URL}/api/v1/user/image/two`, formData, {
          params: { user_tg_id: userId, number },
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPhoto(URL.createObjectURL(file));
        console.log(`${label} успешно обновлено!`);
      } catch (error) {
        console.error(`Ошибка при загрузке ${label}:`, error.message);
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
            onClick={handleEditClick}
          />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default function Profile({ userId }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState(null);
  const [dataProfile, setDataProfile] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.setBackgroundColor('#F2F2F2');
    }

    const fetchUserData = async () => {
      try {
        if (!userId) throw new Error('Не удалось получить Telegram ID');
        const response = await axios.get(`${API_BASE_URL}/api/v1/user_parametrs`, {
          params: { user_tg_id: userId },
        });
        const parameters = Array.isArray(response.data) ? response.data : [response.data];
        const latestParameters = parameters[parameters.length - 1];
        setData(latestParameters);
      } catch (err) {
        console.error('Ошибка при получении параметров:', err.message);
      }
    };

    const fetchUserDataProfile = async () => {
      try {
        if (!userId) throw new Error('Не удалось получить Telegram ID');
        const response = await axios.get(`${API_BASE_URL}/api/v1/user`, {
          params: { user_tg_id: userId },
        });
        setDataProfile(response.data);
        setActiveIndex(response.data.user_level === 'pro' ? 1 : 0);
      } catch (err) {
        console.error('Ошибка при получении данных профиля:', err.message);
      }
    };

    fetchUserDataProfile();
    fetchUserData();
  }, [userId]);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleTouchStart = () => setIsPressed(true);
  const handleTouchEnd = () => setIsPressed(false);

  const handleSelecterClick = async (index) => {
    setActiveIndex(index);
    const level = index === 0 ? 'newbie' : 'pro';
    try {
      if (!userId) throw new Error('Не удалось получить Telegram ID');
      await axios.patch(`${API_BASE_URL}/api/v1/user/level`, {
        level: level,
        user_tg_id: userId,
      });
      console.log('Уровень сложности успешно обновлён:', level);
      const response = await axios.get(`${API_BASE_URL}/api/v1/user`, {
        params: { user_tg_id: userId },
      });
      setDataProfile(response.data);
    } catch (error) {
      console.error('Ошибка при обновлении уровня сложности:', error.message);
    }
  };

  return (
    <div className="profilePage">
      <div className="profileContainer">
        {data ? (
          <div className="profile" style={{ justifyContent: 'space-between' }}>
            <div className="profileData">
              <ProfileBtn level={dataProfile?.user_level} user_photo={dataProfile?.image} />
              <div className="profileName">
                <p>{dataProfile?.name || 'Имя'}</p>
                <span>{dataProfile?.user_level || 'Уровень'}</span>
              </div>
            </div>
            <ButtonEdit onClick={() => navigate('/parameters')} />
          </div>
        ) : (
          <div className="profile">
            <ProfileBtn level={dataProfile?.user_level} user_photo={dataProfile?.image} />
            <div className="profileName">
              <p>{dataProfile?.name || 'Имя'}</p>
              <span>{dataProfile?.user_level || 'Уровень'}</span>
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
                    <p>{dataProfile?.born_date ? new Date().getFullYear() - new Date(dataProfile.born_date).getFullYear() : '-'}</p>
                  </div>
                  <div className="value">
                    <span>Пол</span>
                    <p>{dataProfile?.sex || '-'}</p>
                  </div>
                </div>
                <div className="param">
                  <div className="value">
                    <span>Обхват груди</span>
                    <p>{data.chest || 0}</p>
                  </div>
                  <div className="value">
                    <span>Обхват талии</span>
                    <p>{data.waist || 0}</p>
                  </div>
                </div>
                <div className="param">
                  <div className="value">
                    <span>Обхват живота</span>
                    <p>{data.abdominal_circumference || 0}</p>
                  </div>
                  <div className="value">
                    <span>Обхват бедер</span>
                    <p>{data.hips || 0}</p>
                  </div>
                </div>
                <div className="param">
                  <div className="value">
                    <span>Обхват ноги</span>
                    <p>{data.legs || 0}</p>
                  </div>
                  <div className="value">
                    <span>Вес</span>
                    <p>{data.weight || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="photosContainerBefore">
              <h3>Фотографии</h3>
              <p>До и после тренировочной недели</p>
              <div className="photosBefore">
                <PhotoEditor label="Фото до" initialPhoto={img} userId={userId} number={0} />
                <PhotoEditor label="Фото после" initialPhoto={img} userId={userId} number={1} />
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