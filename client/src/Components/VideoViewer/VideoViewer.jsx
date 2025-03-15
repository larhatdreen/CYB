import React, { useState, useRef, useEffect } from 'react';
import './VideoViewer.css';
import axios from 'axios';
import { API_BASE_URL } from '../../API'; // Предполагаю, что у вас есть этот импорт

import play from '../../Assets/svg/play.svg';
import pause from '../../Assets/svg/pause.svg';

const VideoViewer = ({ videoSrc, page, userId }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPlayButton, setShowPlayButton] = useState(true);

  // Обновление прогресса и времени
  const updateProgress = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      const progressPercent = (current / total) * 100 || 0;
      setProgress(progressPercent);

      const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };
      setCurrentTime(formatTime(current));
      setDuration(formatTime(total));
    }
  };

  // Переключение воспроизведения
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        sendVideoUpdate(); // Отправляем данные при паузе
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowPlayButton(true);
      setTimeout(() => setShowPlayButton(false), 5000);
    }
  };

  // Перемотка по клику на прогресс-бар
  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * (videoRef.current?.duration || 0);
    if (videoRef.current) videoRef.current.currentTime = newTime;
  };

  // Отправка данных на сервер
  const sendVideoUpdate = async () => {
    if (!videoRef.current || !userId) return;

    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    const remainingTime = total - current; // Оставшееся время

    try {
      await axios.patch(`${API_BASE_URL}/api/v1/user/video`, {
        user_tg_id: userId,
        last_video: page, // Текущая страница, например '/begin'
        last_video_time: remainingTime, // Оставшееся время в секундах
      });
      console.log('Видео прогресс обновлён:', { page, remainingTime });
    } catch (error) {
      console.error('Ошибка при обновлении видео прогресса:', error.message);
    }
  };

  // Обработчики событий
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', () => {
        setDuration(formatTime(video.duration));
      });

      // Отправка данных при выходе из компонента
      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        if (isPlaying) sendVideoUpdate(); // Отправляем, если видео было на паузе или воспроизводилось
      };
    }
  }, [isPlaying, page, userId]); // Зависимости для отправки при изменении

  return (
    <div className="videoViewer">
      <video
        ref={videoRef}
        className="videoElement"
        src={videoSrc}
        onClick={togglePlay}
      />
      <button
        className="playButton"
        style={{ opacity: showPlayButton ? '1' : '0' }}
        onClick={togglePlay}
      >
        <img src={isPlaying ? pause : play} alt="Управление воспроизведением" />
      </button>
      <div
        className="controlsContainer"
        style={{ opacity: showPlayButton ? '1' : '0' }}
      >
        <div className="timeDisplay">
          <p>{currentTime}</p>
          <p>{duration}</p>
        </div>
        <div className="progressBar" onClick={handleProgressClick}>
          <div
            className="progressFill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция форматирования времени
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default VideoViewer;