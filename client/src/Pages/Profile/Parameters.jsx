import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

import ProfileBtn from '../../Components/ProfileBtn/ProfileBtn';
import Button from '../../Components/Button/Button';

import example from '../../Assets/img/example.jpeg';
import add from '../../Assets/svg/addImg.svg'
import close from '../../Assets/svg/closeWhite.svg'
import axios from 'axios';

const InputPair = ({ labels, values, onChange, handleBlur, handleFocus }) => {

    return (
        <div className="inputPair">
            {labels.map((label, i) => (
                <div key={label} className="inputGroup">
                    <label>{label}</label>
                    {label === 'Пол' ? (
                        <select value={values[i]} onChange={onChange(i)}>
                            <option value="W">Женский</option>
                            <option value="M">Мужской</option>
                        </select>
                    ) : (
                        <input
                            type="text"
                            value={values[i]}
                            onChange={onChange(i)}
                            placeholder="0"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    )}
                </div>
            ))}
        </div>
    )
};

const PhotoUploader = ({ label, value, onChange }) => {
    const fileInputRef = React.useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click(); // Активируем скрытый input при клике
    };

    return (
        <div className="photoUploader" onClick={handleClick}>
            <label>{label}</label>
            <input
                type="file"
                accept="image/*"
                onChange={onChange}
                ref={fileInputRef}
                style={{ display: 'none' }} // Скрываем стандартный input
            />
            {value ? (
                <div className="uploadContainer">
                    <img
                        src={typeof value === 'string' ? value : URL.createObjectURL(value)}
                        alt={label}
                        className="previewImage"
                        onClick={(e) => e.stopPropagation()} // Предотвращаем повторный клик на родителе
                    />
                    <img className='closePhoto' src={close} alt="Закрыть" />
                </div>
            ) : (
                <div className="uploadPlaceholderContainer">
                    <img src={add} className="uploadPlaceholder" />
                </div>
            )}
        </div>
    );
};

export default function Parameters() {
    const [isMobile, setIsMobile] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        gender: '', age: '', chest: '', waist: '',
        belly: '', hips: '', leg: '', weight: '',
        photoBefore: null, photoAfter: null,
    });

    // Определение платформы
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            const platform = tg.platform.toLowerCase();
            setIsMobile(!['tdesktop', 'macos', 'linux', 'web'].includes(platform));
        }
    }, []);

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

    const handleChange = (field, index) => (e) => {
        const value = index === undefined ? e.target.files[0] : e.target.value;
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) data.append(key, value);
        });
        try {
            await axios.post('API_URL', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            console.log('Данные сохранены!');
            navigate('/profile')
        } catch (error) {
            console.error('Ошибка:', error);
            console.log('Ошибка при сохранении.');
        }
    };

    const inputPairs = [
        { labels: ['Пол', 'Возраст'], fields: ['gender', 'age'] },
        { labels: ['Обхват груди', 'Обхват талии'], fields: ['chest', 'waist'] },
        { labels: ['Обхват живота', 'Обхват бедер'], fields: ['belly', 'hips'] },
        { labels: ['Обхват ноги', 'Вес'], fields: ['leg', 'weight'] },
    ];

    return (
        <div className="profilePage" ref={formRef}>
            <div className="profileContainer">
                <div className="profile">
                    <ProfileBtn />
                    <div className="profileName">
                        <p>name</p>
                        <span>level</span>
                    </div>
                </div>
                <div className="howSize">
                    <h3>Как измерить параметры?</h3>
                    <div className="example">
                        <div className="examplePhoto">
                            <img src={example} alt="Пример измерения" />
                        </div>
                        <div className="solution">
                            <p>Измеряем по самым выпирающим точкам обхват:</p>
                            {['Груди', 'Талии', 'Живота', 'Бедер', 'Ноги'].map((item) => (
                                <div key={item} className="sol">
                                    <div className="dot" />
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="inputsSection">
                    {inputPairs.map(({ labels, fields }) => (
                        <InputPair
                            isMobile={isMobile}
                            key={labels[0]}
                            labels={labels}
                            values={[formData[fields[0]], formData[fields[1]]]}
                            onChange={(i) => handleChange(fields[i], i)}
                            handleFocus={handleFocus}
                            handleBlur={handleBlur}
                        />
                    ))}
                    <div className="loadPhotos">
                        <PhotoUploader
                            label="Фото до"
                            value={formData.photoBefore}
                            onChange={handleChange('photoBefore')}
                        />
                        <PhotoUploader
                            label="Фото после"
                            value={formData.photoAfter}
                            onChange={handleChange('photoAfter')}
                        />
                    </div>
                    <Button text='Сохранить' width='100%' bg='#CBFF52' bgFocus='#EBFFBD' color='#0D0D0D' onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}