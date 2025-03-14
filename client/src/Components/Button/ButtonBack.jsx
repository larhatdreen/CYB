import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Button.css';
import back from '../../Assets/svg/back.svg';

export default function ButtonBack({ text = 'Назад', onClick }) {
  const navigate = useNavigate();

  // Функция по умолчанию: возврат на предыдущую страницу
  const defaultOnClick = () => navigate(-1);

  // Используем переданный onClick или дефолтный
  const handleClick = onClick || defaultOnClick;

  // Управление Telegram BackButton
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const backButton = window.Telegram.WebApp.BackButton;

      // Показываем встроенную кнопку Telegram
      backButton.show();

      // Привязываем обработчик клика
      backButton.onClick(handleClick);

      // Очищаем при размонтировании
      return () => {
        backButton.offClick(handleClick);
        backButton.hide();
      };
    }
  }, [handleClick]); // Зависимость от handleClick, чтобы обновлять обработчик при изменении onClick

  return (
    <button className="backBtn" onClick={handleClick}>
      <img src={back} alt="Назад" />
      <p>{text}</p>
    </button>
  );
}