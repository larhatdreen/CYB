import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import axios from 'axios';

import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Selecter from '../../Components/Selecter/Selecter';
import ButtonEdit from '../../Components/Button/ButtonEdit';
import Button from '../../Components/Button/Button';

import settings from '../../Assets/svg/settings.svg';
import right from '../../Assets/svg/right.svg';
import close from '../../Assets/svg/close.svg';

// Компонент InputPair без поля "Пол"
const InputPair = ({ labels, values, onChange, handleBlur, handleFocus }) => (
  <div className="inputPair" style={{ display: 'flex' }}>
    {labels.map((label, i) => (
      <div key={label} className="inputGroup">
        <label>{label}</label>
        <input
          type="text"
          value={values[i]}
          onChange={onChange(i)}
          placeholder="0"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    ))}
  </div>
);

export default function Record() {
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeWeek, setActiveWeek] = useState(1);
  const [formData, setFormData] = useState({
    chest: '', waist: '', belly: '', hips: '', leg: '', weight: '',
  });

  // Запрос для получения активной недели
  useEffect(() => {
    const fetchActiveWeek = async () => {
      try {
        const response = await axios.get('/api/active-week');
        setActiveWeek(parseInt(response.data.activeWeek, 10));
      } catch (error) {
        console.error('Ошибка при получении активной недели:', error);
      }
    };
    fetchActiveWeek();
  }, []);

  // Определение платформы
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
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    data.append('week', activeWeek); // Добавляем информацию о неделе

    try {
      await axios.post('/api/record-progress', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Прогресс сохранён для недели', activeWeek);
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при сохранении прогресса:', error);
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

    const scrollOffset = inputRect.top - containerRect.top - (containerRect.height * 0.3);

    container.scrollTo({
      top: container.scrollTop + scrollOffset,
      behavior: 'smooth'
    });
  };

  const handleBlur = () => {
    if (!isMobile || !formRef.current) return;
    const container = formRef.current;
    container.style.transform = 'none';
    container.style.transition = 'transform 150ms ease-in-out';
  };

  // Массив пар инпутов без пола и возраста
  const inputPairs = [
    { labels: ['Обхват груди', 'Обхват талии'], fields: ['chest', 'waist'] },
    { labels: ['Обхват живота', 'Обхват бедер'], fields: ['belly', 'hips'] },
    { labels: ['Обхват ноги', 'Вес'], fields: ['leg', 'weight'] },
  ];

  return (
    <div className="profilePage" ref={formRef}>
      <div className="profileContainer">
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
                  className={`week ${weekNumber < activeWeek ? 'past' : ''} ${weekNumber === activeWeek ? 'active' : ''
                    }`}
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