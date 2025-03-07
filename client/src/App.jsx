import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    // Проверяем, что Telegram Web App доступен
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand() 
      const user = window.Telegram.WebApp.initDataUnsafe.user; // Получаем данные пользователя
      console.log("Пользователь:", user); // Выводим в консоль для теста
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Привет, это Mini App!</h1>
      <p>Открой консоль браузера, чтобы увидеть данные пользователя.</p>
    </div>
  );
}

export default App;