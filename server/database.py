import sqlite3

def init_db():
    """Инициализация базы данных и создание таблиц"""
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                 tg_id INTEGER PRIMARY KEY,
                 photo_url TEXT,
                 tariff TEXT,
                 transaction_id TEXT UNIQUE,
                 access_granted BOOLEAN,
                 name TEXT,
                 gender TEXT,
                 phone TEXT,
                 birthday TEXT,
                 difficulty TEXT
                 )''')
    c.execute('''CREATE TABLE IF NOT EXISTS transactions (
                 transaction_id TEXT PRIMARY KEY,
                 status TEXT,
                 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                 )''')
    conn.commit()
    conn.close()

def save_user(user_data):
    """Сохранение или обновление данных пользователя"""
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO users 
                 (tg_id, photo_url, tariff, transaction_id, access_granted, name, gender, phone, birthday, difficulty)
                 VALUES (:tg_id, :photo_url, :tariff, :transaction_id, :access_granted, :name, :gender, :phone, :birthday, :difficulty)''',
              user_data)
    if user_data.get("transaction_id"):
        c.execute('INSERT OR IGNORE INTO transactions (transaction_id, status) VALUES (?, ?)',
                  (user_data["transaction_id"], "completed"))
    conn.commit()
    conn.close()

def get_user(user_tg_id):
    """Получение данных пользователя по tg_id"""
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE tg_id = ?", (user_tg_id,))
    result = c.fetchone()
    conn.close()
    if result:
        return {
            "tg_id": result[0],
            "photo_url": result[1],
            "tariff": result[2],
            "transaction_id": result[3],
            "access_granted": bool(result[4]),
            "name": result[5],
            "gender": result[6],
            "phone": result[7],
            "birthday": result[8],
            "difficulty": result[9]
        }
    return None

def update_user_access(user_tg_id, user_data):
    """Обновление данных доступа пользователя"""
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''UPDATE users SET access_granted = :access_granted, 
                 tariff = :tariff, transaction_id = :transaction_id 
                 WHERE tg_id = :tg_id''', user_data)
    conn.commit()
    conn.close()

def get_transaction(transaction_id):
    """Проверка существования транзакции"""
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT transaction_id FROM transactions WHERE transaction_id = ?", (transaction_id,))
    result = c.fetchone()
    conn.close()
    return result is not None