import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';
import Progress from '../../Components/Progress/Progress';
import Button from '../../Components/Button/Button';
import ButtonBack from '../../Components/Button/ButtonBack';
import { useNavigate } from 'react-router-dom';

import a from '../../Assets/quiz/a.svg';
import aa from '../../Assets/quiz/aa.svg';
import b from '../../Assets/quiz/b.svg';
import bb from '../../Assets/quiz/bb.svg';
import c from '../../Assets/quiz/c.svg';
import cc from '../../Assets/quiz/cc.svg';
import d from '../../Assets/quiz/d.svg';
import dd from '../../Assets/quiz/dd.svg';
import e from '../../Assets/quiz/e.svg';
import f from '../../Assets/quiz/f.svg';
import ff from '../../Assets/quiz/ff.svg';
import g from '../../Assets/quiz/g.svg';

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [name, setName] = useState('');
  const [gen, setGen] = useState('m');
  const [tel, setTel] = useState('');
  const [birthday, setBirthday] = useState('');
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const formRef = useRef(null);

  // Refs для полей ввода
  const nameRef = useRef(null);
  const telRef = useRef(null);
  const birthdayRef = useRef(null);

  // Данные для шагов 2-8
  const quizData = [
    {
      question: 'Обладаете ли вы достаточным уровнем знаний и пониманием выполнения базовых движений?',
      options: [
        { text: 'Да, знаю технику и выполняю уверенно', img: a },
        { text: 'Нет, не уверен(а) в технике', img: aa },
      ],
    },
    {
      question: 'Как часто вы тренировались в последние 3 месяца?',
      options: [
        { text: 'Регулярно (3-5 раз в неделю)', img: b },
        { text: 'Иногда (1-2 раза в неделю)', img: bb },
      ],
    },
    {
      question: 'Как вы оцениваете свою силу?',
      options: [
        { text: 'Высокая', img: c },
        { text: 'Средняя', img: cc },
      ],
    },
    {
      question: 'Как оцениваете свою выносливость?',
      options: [
        { text: 'Высокая', img: d },
        { text: 'Средняя', img: dd },
      ],
    },
    {
      question: 'Какой у вас уровень физической активности в повседневной жизни?',
      options: [
        { text: 'Высокий', img: b },
        { text: 'Средний', img: e },
      ],
    },
    {
      question: 'Как вы чувствуете себя после тренировки?',
      options: [
        { text: 'Энергичным', img: f },
        { text: 'Уставшим', img: ff },
      ],
    },
    {
      question: 'Какой уровень сложности тренировок вам комфортен?',
      options: [
        { text: 'Высокий', img: g },
        { text: 'Средний', img: dd },
      ],
    },
  ];

  // Проверка даты рождения
  const isDateValid = (date) => {
    if (!/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[012])\.(19|20)\d\d$/.test(date)) return false;
    const [day, month, year] = date.split('.').map(Number);
    const birthDate = new Date(year, month - 1, day);
    if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() + 1 !== month ||
      birthDate.getDate() !== day
    ) return false;
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate());
    return birthDate < minDate;
  };

  // Обработчики ввода
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/[^\d+]/g, '');
    if (value.length === 1) {
      if (value === '7' || value === '+') value = '+7';
      else if (value === '8') value = '8';
      else value = `+7${value}`;
    }
    const maxLength = value.startsWith('+') ? 12 : 11;
    if (value.length > maxLength) return;

    setTel(value);

    // Если достигнута максимальная длина, снимаем фокус
    if (value.length === maxLength && telRef.current) {
      telRef.current.blur(); // Снимаем фокус, что вызовет onBlur
    }
  };

  const handleBirthdayChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 3) return;
    let newValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i === 2 || i === 5) newValue += '.';
      newValue += value[i];
    }
    newValue = newValue.replace(/\.+/g, '.');
    if (newValue.length > 10) return;

    setBirthday(newValue);

    // Если достигнута максимальная длина, снимаем фокус
    if (newValue.length === 10 && birthdayRef.current) {
      birthdayRef.current.blur(); // Снимаем фокус, что вызовет onBlur
    }
  };

  // Валидация
  useEffect(() => {
    if (step === 1) {
      const isNameValid = name.trim().length > 0;
      const isTelValid = /^(\+7|7|8)\d{10}$/.test(tel.replace(/[^0-9]/g, ''));
      const isDateValidValue = isDateValid(birthday);
      setIsValid(isNameValid && isTelValid && isDateValidValue);
    } else {
      setIsValid(selectedOption !== null);
    }
  }, [step, name, tel, birthday, selectedOption]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.setBackgroundColor('#fff');
      const platform = tg.platform;
      setIsMobile(platform !== 'tdesktop' && platform !== 'macos');
    }
  }, []);

  const handleFocus = (e) => {
    if (!isMobile) return;

    const input = e.target;
    const container = formRef.current;

    // Получаем позиции элементов
    const containerRect = container.getBoundingClientRect();
    const inputRect = input.getBoundingClientRect();

    // Рассчитываем относительные координаты инпута внутри контейнера
    const relativeLeft = inputRect.left - containerRect.left;
    const relativeTop = inputRect.top - containerRect.top;

    // Вычисляем процентное положение для transformOrigin
    const originX = (relativeLeft / containerRect.width) * 130;
    const originY = (relativeTop / containerRect.height) * 130;

    // Применяем масштабирование относительно позиции инпута
    container.style.transformOrigin = `${originX}% ${originY}%`;
    container.style.transform = `scale(1.3)`;
    container.style.transition = 'transform 0.3s ease';

    // Рассчитываем смещение для прокрутки
    const scrollOffset = inputRect.top - containerRect.top - (containerRect.height * 0.3);

    // Плавная прокрутка с учетом масштабирования
    container.scrollTo({
      top: container.scrollTop + scrollOffset,
      behavior: 'smooth',
    });
  };

  const handleBlur = () => {
    if (!isMobile) return;

    const container = formRef.current;
    container.style.transform = 'none';
    container.style.transition = 'transform 0.3s ease';
  };

  // Переход на следующий шаг
  const handleNext = () => {
    if (step < 8) {
      setAnswers([...answers, selectedOption]);
      setSelectedOption(null);
      setOpacity(0);
      setTimeout(() => {
        setStep(step + 1);
        setOpacity(1);
      }, 150);
    } else {
      const finalAnswers = [...answers, selectedOption];
      console.log('Отправка данных:', { name, gen, tel, birthday, answers: finalAnswers });
      navigate('/result');
    }
  };

  // Переход на предыдущий шаг
  const handleBack = () => {
    if (step > 1) {
      setOpacity(0);
      setTimeout(() => {
        setStep(step - 1);
        setSelectedOption(answers[step - 2]);
        setAnswers(answers.slice(0, -1));
        setOpacity(1);
      }, 150);
    }
  };

  // Рендеринг контента
  const renderQuizContent = () => {
    if (step === 1) {
      return (
        <>
          <div className="name">
            <p className="titleInput">Имя</p>
            <input
              type="text"
              placeholder="Введите ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              ref={nameRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus={!name}
            />
          </div>
          <div className="name">
            <p className="titleInput">Пол</p>
            <div className="selectGender">
              <button
                className={`genderBtn ${gen === 'm' ? 'active' : ''}`}
                onClick={() => setGen('m')}
              >
                М
              </button>
              <button
                className={`genderBtn ${gen === 'w' ? 'active' : ''}`}
                onClick={() => setGen('w')}
              >
                Ж
              </button>
            </div>
          </div>
          <div className="name">
            <p className="titleInput">Номер телефона</p>
            <input
              type="tel"
              placeholder="7 999 999 99 99"
              value={tel}
              onChange={handlePhoneChange}
              ref={telRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus={!tel}
            />
          </div>
          <div className="name">
            <p className="titleInput">Дата рождения</p>
            <input
              type="text"
              placeholder="дд.мм.гггг"
              value={birthday}
              onChange={handleBirthdayChange}
              ref={birthdayRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus={!birthday}
            />
          </div>
        </>
      );
    } else {
      const currentData = quizData[step - 2];
      return (
        <div className="quizOptions">
          {currentData.options.map((option, index) => (
            <button
              key={index}
              className={`quizAnswer ${selectedOption === index ? 'active' : ''}`}
              onClick={() => setSelectedOption(index)}
            >
              <img src={option.img} alt="" />
              <p>{option.text}</p>
            </button>
          ))}
        </div>
      );
    }
  };

  // Заголовок шага
  const getStepTitle = () => {
    return step === 1 ? 'Давайте знакомиться!' : quizData[step - 2].question;
  };

  // Текст кнопки
  const buttonText = step === 8 ? 'Завершить' : 'Далее';

  return (
    <div className={`quizPage ${isFocused ? 'focused' : ''}`} ref={formRef}>
      <div className="forBack">
        {step !== 1 && <ButtonBack onClick={handleBack} />}
      </div>
      <div className="topPage">
        <h1>{getStepTitle()}</h1>
        <Progress title={'Шаг'} count_all={8} count_complited={step} />
      </div>
      <div className="bottomPage">
        <div className="quizContent" style={{ opacity, transition: 'opacity 150ms ease' }}>
          {renderQuizContent()}
        </div>
        <Button text={buttonText} onClick={handleNext} disabled={!isValid} />
      </div>
    </div>
  );
}