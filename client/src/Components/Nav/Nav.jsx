import React, { useState, useEffect } from 'react';
import './Nav.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import dashboard from '../../Assets/nav/dashboard.svg';
import muscles from '../../Assets/nav/musclesBlack.svg';
import food from '../../Assets/nav/food.svg';
import chat from '../../Assets/nav/chat.svg';
import profile from '../../Assets/nav/user.svg';
import back from '../../Assets/nav/back.svg';
import lock from '../../Assets/svg/lock.svg';

// Массив с данными для навигации
const navItems = [
  { path: '/dashboard', icon: dashboard, label: 'Меню' },
  { path: '/training', icon: muscles, label: 'Тренировки' },
  { path: '/food', icon: food, label: 'Питание' },
  { path: '/communication', icon: chat, label: 'Общение' },
  { path: '/profile', icon: profile, label: 'Профиль' },
];

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pressedPath, setPressedPath] = useState(null);
  const [prevPath, setPrevPath] = useState(null); // Хранит предыдущий путь

  // Сохраняем предыдущий путь при изменении location
  useEffect(() => {
    // Сохраняем текущий путь как предыдущий перед его изменением
    const currentPath = location.pathname;
    return () => {
      setPrevPath(currentPath); // Предыдущий путь сохраняется при размонтировании эффекта
    };
  }, [location]);

  // Проверяем, является ли текущий путь одним из путей в navItems
  const isCurrentPathInNav = navItems.some((item) => item.path === location.pathname);

  // Проверяем, нужно ли отключить ссылку (для /training и /food)
  const isLinkDisabled = (path) => path === '/training' || path === '/food';

  // Обработчики событий для управления состоянием нажатия
  const handleMouseDown = (path) => setPressedPath(path);
  const handleMouseUp = () => setPressedPath(null);
  const handleTouchStart = (path) => setPressedPath(path);
  const handleTouchEnd = () => setPressedPath(null);

  // Обработчик клика
  const handleClick = (path) => {
    if (path === prevPath && !isCurrentPathInNav && window.history.length > 1) {
      navigate(-1); // Возвращаемся на предыдущую страницу
    }
  };

  return (
    <div className="navContainer">
      <div className="navMenu">
        {navItems.map((item) => (
          <div
            key={item.path}
            className="nav"
            onMouseDown={() => handleMouseDown(item.path)}
            onMouseUp={handleMouseUp}
            onTouchStart={() => handleTouchStart(item.path)}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
              if (item.path === prevPath && !isCurrentPathInNav) {
                e.preventDefault();
                handleClick(item.path);
              } else if (isLinkDisabled(item.path)) {
                e.preventDefault(); // Отключаем переход для /training и /food
              }
            }}
          >
            {item.path === prevPath && !isCurrentPathInNav ? (
              // Кнопка с иконкой возврата и другим фоном
              <div
                className="navLink"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.path);
                }}
              >
                <div
                  className={`forIcon active ${pressedPath === item.path ? 'pressed' : ''}`}
                >
                  <img src={back} alt={`${item.label} назад`} />
                </div>
                <p>{item.label}</p>
              </div>
            ) : (
              <Link
                to={isLinkDisabled(item.path) ? undefined : item.path} // Убираем to для отключенных путей
                className="navLink"
                style={{pointerEvents: isLinkDisabled(item.path) ? 'none' : ''}}
              >
                <div
                  className={`forIcon ${location.pathname === item.path ? 'active' : ''} ${
                    pressedPath === item.path ? 'pressed' : ''
                  }`}
                  style={{
                    background: isLinkDisabled(item.path) ? 'rgb(32,32,32)' : '',
                    pointerEvents: isLinkDisabled(item.path) ? 'none' : '',
                  }}
                >
                  <img
                    src={isLinkDisabled(item.path) ? lock : item.icon}
                    style={{
                      width: isLinkDisabled(item.path) ? '24px' : '',
                      height: isLinkDisabled(item.path) ? '24px' : '',
                    }}
                    alt={item.label}
                  />
                </div>
                <p>{item.label}</p>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}