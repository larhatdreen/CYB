import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import axios from 'axios';
import { API_BASE_URL } from '../../API';

import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Selecter from '../../Components/Selecter/Selecter';
import ButtonEdit from '../../Components/Button/ButtonEdit';
import Button from '../../Components/Button/Button';

import settings from '../../Assets/svg/settings.svg';
import right from '../../Assets/svg/right.svg';
import close from '../../Assets/svg/close.svg';

const InputPair = ({ labels, values, onChange, handleBlur, handleFocus }) => (
  <div className="inputPair" style={{ display: 'flex' }}>
    {labels.map((label, i) => (
      <div key={label} className="inputGroup">
        <label>{label}</label>
        <input
          type="text"
          value={values[i] || ''}
          onChange={onChange(i)}
          placeholder="0"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    ))}
  </div>
);

export default function Record({ userId }) {
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeWeek, setActiveWeek] = useState(null);
  const [dataProfile, setDataProfile] = useState(null);
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    abdominal_circumference: '',
    hips: '',
    legs: '',
    weight: '',
  });

  useEffect(() => {
    const fetchUserDataProfile = async () => {
      try {
        if (!userId) throw new Error('Не удалось получить Telegram ID');
        const response = await axios.get(`${API_BASE_URL}/api/v1/user`, {
          params: { user_tg_id: userId },
        });
        setDataProfile(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error.message);
      }
    };

    const fetchActiveWeek = async () => {
      try {
        if (!userId) throw new Error('Не удалось получить Telegram ID');
        const response = await axios.get(`${API_BASE_URL}/api/v1/user/week`, {
          params: { user_tg_id: userId },
        });
        const weeks = response.data;
        const active = Object.keys(weeks).find(
          (key) => weeks[key] === true && key !== 'tg_id' && key !== 'id'
        );
        setActiveWeek(active ? parseInt(active.replace('week', ''), 10) || 1 : 1); // Преобразование 'one' -> 1
      } catch (error) {
        console.error('Ошибка при получении активной недели:', error.message);
      }
    };

    fetchUserDataProfile();
    fetchActiveWeek();
  }, [userId]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const platform = tg.platform.toLowerCase();
      setIsMobile(!['tdesktop', 'macos', 'linux', 'web'].includes(platform));
    }
  }, []);

  const handleSelecterClick = (index) => {
    setActiveIndex(index);
  };

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!userId) throw new Error('Не удалось получить Telegram ID');

      const parametersData = {
        tg_id: userId,
        chest: parseFloat(formData.chest) || 0,
        waist: parseFloat(formData.waist) || 0,
        abdominal_circumference: parseFloat(formData.abdominal_circumference) || 0,
        hips: parseFloat(formData.hips) || 0,
        legs: parseFloat(formData.legs) || 0,
        weight: parseFloat(formData.weight) || 0,
        created_at: new Date().toISOString(),
      };

      await axios.post(`${API_BASE_URL}/api/v1/user_parametrs`, parametersData);

      const weekNumber = activeWeek;
      await axios.post(`${API_BASE_URL}/api/v1/user/week`, {
        user_tg_id: userId,
        week_number: weekNumber,
      });

      console.log('Прогресс сохранён для недели', weekNumber);
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error.message);
    }
  };

  const handleFocus = (e) => {
    if (!isMobile || !formRef.current) return;
    const input = e.target;
    const container = formRef.current;
    const containerRect = container.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();
    const relativeLeft = inputRect.left - containerRect.left;
    const relativeTop = inputRect.top - containerRect.top;
    const originX = (relativeLeft / containerRect.width) * 130;
    const originY = (relativeTop / containerRect.height) * 130;
    container.style.transformOrigin = `${originX}% ${originY}%`;
    container.style.transform = `scale(1.5)`;
    container.style.transition = 'transform 150ms ease-in-out';
    const scrollOffset = inputRect.top - containerRect.top - containerRect.height * 0.3;
    container.scrollTo({
      top: container.scrollTop + scrollOffset,
      behavior: 'smooth',
    });
  };

  const handleBlur = () => {
    if (!isMobile || !formRef.current) return;
    const container = formRef.current;
    container.style.transform = 'none';
    container.style.transition = 'transform 150ms ease-in-out';
  };

  const inputPairs = [
    { labels: ['Обхват груди', 'Обхват талии'], fields: ['chest', 'waist'] },
    { labels: ['Обхват живота', 'Обхват бедер'], fields: ['abdominal_circumference', 'hips'] },
    { labels: ['Обхват ноги', 'Вес'], fields: ['legs', 'weight'] },
  ];

  return (
    <div className="profilePage" ref={formRef}>
      <div className="profileContainer">
        <div className="profile" style={{ justifyContent: 'space-between' }}>
          <div className="profileData">
            <ProfileBtn level={dataProfile.user_level} user_photo={dataProfile.image} />
            <div className="profileName">
              <p>{dataProfile?.name || 'Имя'}</p>
              <span>{dataProfile?.user_level || 'Уровень'}</span>
            </div>
          </div>
          <ButtonEdit onClick={() => navigate('/parameters')} />
        </div>
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
        <div className="recordYourProgress">
          <h3>Запишите свой прогресс</h3>
          <div className="weeksContainer">
            <p>Неделя</p>
            <div className="weeks">
              {[1, 2, 3, 4].map((weekNumber) => (
                <div
                  key={weekNumber}
                  className={`week ${weekNumber < activeWeek ? 'past' : ''} ${
                    weekNumber === activeWeek ? 'active' : ''
                  }`}
                  onClick={() => setActiveWeek(weekNumber)}
                >
                  {weekNumber}
                </div>
              ))}
            </div>
          </div>
          <div className="inputsSection">
            {inputPairs.map(({ labels, fields }) => (
              <InputPair
                key={labels[0]}
                labels={labels}
                values={[formData[fields[0]], formData[fields[1]]]}
                onChange={(i) => handleChange(fields[i])}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
              />
            ))}
            <Button
              text="Сохранить"
              width="100%"
              bg="#CBFF52"
              bgFocus="#EBFFBD"
              color="#0D0D0D"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}