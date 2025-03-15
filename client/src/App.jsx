import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import axios from "axios";
import { API_BASE_URL } from './API';

import ButtonClose from "./Components/Button/ButtonClose";
import ButtonBack from "./Components/Button/ButtonBack";
import Nav from "./Components/Nav/Nav";
import StartPage from "./Pages/StartPage/StartPage";
import Quiz from "./Pages/Quiz/Quiz";
import Result from "./Pages/Result/Result";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Begin from "./Pages/Begin/Begin";
import Profile from "./Pages/Profile/Profile";
import Parameters from "./Pages/Profile/Parameters";
import Record from "./Pages/Profile/Record";
import Communication from "./Pages/Communication/Communication";

// Функция для получения всех файлов из папки
function importAll(r) {
  return r.keys().map(r);
}

// Загружаем все изображения из папок
const imgFiles = importAll(require.context('./Assets/img', false, /\.(png|jpe?g|svg)$/));
const navFiles = importAll(require.context('./Assets/nav', false, /\.(png|jpe?g|svg)$/));
const quizFiles = importAll(require.context('./Assets/quiz', false, /\.(png|jpe?g|svg)$/));
const svgFiles = importAll(require.context('./Assets/svg', false, /\.(png|jpe?g|svg)$/));

// Объединяем все файлы в один массив
const allImages = [...imgFiles, ...navFiles, ...quizFiles, ...svgFiles];

// Функция предзагрузки
function preloadImages() {
  allImages.forEach((image) => {
    const img = new Image();
    img.src = image;
  });
}

function Layout() {
  const location = useLocation();
  const hiddenPathsBack = ['/', '/quiz', '/result', '/dashboard'];
  const showControlsBack = !hiddenPathsBack.includes(location.pathname);
  const hiddenPathsNav = ['/', '/quiz', '/result'];
  const showControlsNav = !hiddenPathsNav.includes(location.pathname);

  return (
    <>
      <div className="header">
        {showControlsBack && <ButtonBack />} 
        <ButtonClose /> {/* ButtonClose всегда видна */}
      </div>
      <div className="App">
        <Outlet /> {/* Здесь рендерятся дочерние маршруты */}
        {showControlsNav && <Nav />} {/* Условно показываем Nav */}
      </div>
    </>
  );
}

function App() {
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;

      if (telegramUser) {
        setUserId(telegramUser.id)
        console.log("Пользователь Telegram:", telegramUser);

        const addUserToDatabase = async () => {
          try {
            const userData = {
              tg_id: telegramUser.id, 
              name: telegramUser.first_name || 'Неизвестный', 
              user_tarif: 0, 
              transcation_id: 0, 
              transcation_created_at: new Date().toISOString(),
              image: telegramUser.photo_url
            };

            const response = await axios.post(`${API_BASE_URL}/api/v1/user`, userData);

            console.log('Пользователь успешно добавлен:', response.data);
          } catch (error) {
            console.error('Ошибка при добавлении пользователя:', error.response ? error.response.data : error.message);
          }
        };

        // Вызываем функцию отправки
        addUserToDatabase();
      } else {
        console.error('Пользователь Telegram не найден');
      }
    } else {
      console.error('Telegram WebApp API не найден');
    }
  }, []);

  useEffect(() => {
    // Предзагрузка изображений при загрузке приложения
    preloadImages();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StartPage userId={userId} />} />
          <Route path="quiz" element={<Quiz userId={userId} />} />
          <Route path="result" element={<Result userId={userId} />} />
          <Route path="dashboard" element={<Dashboard userId={userId} />} />
          <Route path="begin" element={<Begin userId={userId} />} />
          <Route path="profile" element={<Profile userId={userId} />} />
          <Route path="parameters" element={<Parameters userId={userId} />} />
          <Route path="record" element={<Record userId={userId} />} />
          <Route path="communication" element={<Communication userId={userId} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;