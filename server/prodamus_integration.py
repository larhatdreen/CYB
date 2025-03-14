import requests
import hashlib
import hmac
import json

# Замените на реальные данные от Prodamus
PRODAMUS_API_KEY = "your_prodamus_api_key"
PRODAMUS_SECRET_KEY = "your_prodamus_secret_key"
PRODAMUS_API_URL = "https://api.prodamus.com/v1/transactions/verify"

def verify_transaction(transaction_id):
    """Верификация транзакции через API Prodamus (заглушка)"""
    # Пример заглушки, замените на реальный запрос
    try:
        # Подготовка данных для подписи
        data = {
            "transaction_id": transaction_id,
            "api_key": PRODAMUS_API_KEY
        }
        # Создание подписи (пример, зависит от документации Prodamus)
        message = json.dumps(data, sort_keys=True).encode()
        signature = hmac.new(
            PRODAMUS_SECRET_KEY.encode(),
            message,
            hashlib.sha256
        ).hexdigest()

        # Отправка запроса
        response = requests.post(PRODAMUS_API_URL, json=data, headers={
            "X-Signature": signature,
            "Content-Type": "application/json"
        })
        response_data = response.json()

        if response.status_code == 200 and response_data.get("status") == "success":
            return True
        return False
    except Exception as e:
        print(f"Ошибка при верификации транзакции: {e}")
        return False