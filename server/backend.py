from flask import Flask, request, jsonify
from database import init_db, save_user, get_user, update_user_access, get_transaction
from prodamus_integration import verify_transaction
import logging

app = Flask(__name__)

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Инициализация базы данных при запуске
init_db()

@app.route('/webhook', methods=['POST'])
def handle_webhook():
    """Обработка уведомлений от Prodamus о платеже"""
    data = request.get_json()
    logger.info(f"Получен webhook: {data}")

    transaction_id = data.get('transaction_id')
    tariff = data.get('tariff')  # base или pro
    user_tg_id = data.get('user_tg_id')

    if not all([transaction_id, tariff, user_tg_id]):
        return jsonify({"error": "Отсутствуют необходимые данные"}), 400

    # Проверяем, существует ли транзакция в базе
    if get_transaction(transaction_id):
        return jsonify({"message": "Транзакция уже обработана"}), 200

    # Верификация транзакции через Prodamus API
    is_valid = verify_transaction(transaction_id)
    if not is_valid:
        return jsonify({"error": "Недействительная транзакция"}), 400

    # Сохраняем данные пользователя и даем доступ
    user_data = {
        "tg_id": user_tg_id,
        "tariff": tariff,
        "transaction_id": transaction_id,
        "access_granted": True,
        "photo_url": None,  # Пока нет фото
        "name": None,
        "gender": None,
        "phone": None,
        "birthday": None,
        "difficulty": None
    }
    save_user(user_data)
    return jsonify({"message": "Доступ предоставлен", "user_tg_id": user_tg_id}), 200

@app.route('/start', methods=['POST'])
def handle_start():
    """Обработка команды /start с сохранением tg_id и фото"""
    data = request.get_json()
    user_tg_id = data.get('user_tg_id')
    photo_url = data.get('photo_url')

    if not user_tg_id:
        return jsonify({"error": "user_tg_id обязателен"}), 400

    user_data = get_user(user_tg_id)
    if not user_data:
        user_data = {"tg_id": user_tg_id, "photo_url": photo_url, "access_granted": False}
        save_user(user_data)
    else:
        user_data["photo_url"] = photo_url or user_data.get("photo_url")
        update_user_access(user_tg_id, user_data)

    return jsonify({"message": "Пользователь зарегистрирован", "access_granted": user_data["access_granted"]}), 200

@app.route('/verify_transaction', methods=['POST'])
def verify_user_transaction():
    """Проверка транзакции, введенной пользователем"""
    data = request.get_json()
    user_tg_id = data.get('user_tg_id')
    transaction_id = data.get('transaction_id')
    tariff = data.get('tariff')

    if not all([user_tg_id, transaction_id, tariff]):
        return jsonify({"error": "Отсутствуют необходимые данные"}), 400

    # Проверяем уникальность транзакции
    if get_transaction(transaction_id):
        return jsonify({"error": "Транзакция уже использована"}), 400

    # Верификация через Prodamus
    is_valid = verify_transaction(transaction_id)
    if not is_valid:
        return jsonify({"error": "Недействительная транзакция"}), 400

    # Обновляем доступ пользователя
    user_data = get_user(user_tg_id) or {"tg_id": user_tg_id, "access_granted": False}
    user_data.update({"tariff": tariff, "transaction_id": transaction_id, "access_granted": True})
    save_user(user_data)

    return jsonify({"message": "Доступ предоставлен", "tariff": tariff}), 200

@app.route('/submit_form', methods=['POST'])
def submit_form():
    """Сохранение данных формы (имя, пол, телефон, дата рождения)"""
    data = request.get_json()
    user_tg_id = data.get('user_tg_id')
    name = data.get('name')
    gender = data.get('gender')
    phone = data.get('phone')
    birthday = data.get('birthday')

    if not user_tg_id or not all([name, gender, phone, birthday]):
        return jsonify({"error": "Отсутствуют необходимые данные"}), 400

    user_data = get_user(user_tg_id) or {"tg_id": user_tg_id}
    user_data.update({
        "name": name,
        "gender": gender,
        "phone": phone,
        "birthday": birthday
    })
    save_user(user_data)
    return jsonify({"message": "Данные формы сохранены"}), 200

@app.route('/submit_difficulty', methods=['POST'])
def submit_difficulty():
    """Сохранение уровня сложности (новичок или профи)"""
    data = request.get_json()
    user_tg_id = data.get('user_tg_id')
    difficulty = data.get('difficulty')

    if not user_tg_id or not difficulty:
        return jsonify({"error": "Отсутствуют необходимые данные"}), 400

    user_data = get_user(user_tg_id) or {"tg_id": user_tg_id}
    user_data.update({"difficulty": difficulty})
    save_user(user_data)
    return jsonify({"message": "Уровень сложности сохранён", "difficulty": difficulty}), 200

@app.route('/check_access', methods=['GET'])
def check_access():
    """Проверка доступа пользователя"""
    user_tg_id = request.args.get('user_tg_id')
    if not user_tg_id:
        return jsonify({"error": "user_tg_id обязателен"}), 400

    user_data = get_user(user_tg_id)
    if not user_data or not user_data.get("access_granted"):
        return jsonify({"access_granted": False}), 200

    return jsonify({
        "access_granted": True,
        "tariff": user_data.get("tariff"),
        "difficulty": user_data.get("difficulty")
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)