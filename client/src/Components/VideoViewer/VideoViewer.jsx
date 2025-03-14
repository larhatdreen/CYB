import React, { useState, useRef, useEffect } from 'react';
import './VideoViewer.css';

import play from '../../Assets/svg/play.svg';
import pause from '../../Assets/svg/pause.svg';
// import fullscreen from '../../Assets/svg/fullscreen.svg';
// import fullscreenExit from '../../Assets/svg/fullscreenExit.svg';

const VideoViewer = ({ videoSrc }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [showPlayButton, setShowPlayButton] = useState(true);
//   const [isExpanded, setIsExpanded] = useState(false);

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

  // Полноэкранный режим через Telegram API
//   const toggleExpand = () => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       window.Telegram.WebApp.expand();
//       setIsExpanded(true);
//     }
//   };

  // Обработчики событий
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', () => {
        setDuration(formatTime(video.duration));
      });

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  return (
    <div className="videoViewer">
      <video
        ref={videoRef}
        className="videoElement"
        src={videoSrc}
        onClick={togglePlay}
      />
      {/* <button className="fullscreenButton" onClick={toggleExpand}>
          <img src={isExpanded ? fullscreenExit : fullscreen} alt="Режим полного экрана" />
        </button> */}
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