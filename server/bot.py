import asyncio
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

TOKEN = "7362756138:AAH2TypI3ks7DZnSNcozovuYJPipNfD04bs"
dp = Dispatcher()
bot = Bot(token=TOKEN)

@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    # Получаем user_id пользователя
    user_id = message.from_user.id
    print(f"Пользователь с ID {user_id} стартовал бота")

    # Создаем кнопку с ссылкой на Mini App
    builder = InlineKeyboardBuilder()

    builder.button(
        text="Открыть приложение", 
        web_app=WebAppInfo(url="https://191b-178-73-210-47.ngrok-free.app")
    )

    builder.button(
        text="Поддержка",
        url="https://t.me/zabota_CYB" 
    )

    builder.adjust(1)

    text = (
        "**Добро пожаловать в CYB 2.0!**"
        "**Это уникальный формат марафона в виде приложения прямо в вашем Telegram\\.**\n\n"
        "Для того, чтобы активировать свой личный кабинет нажмите кнопку «Открыть приложение»\n\n"
        "Если у вас появятся вопросы, то нажмите на кнопку «Поддержка»\n"
        "Или напишите нам в @zabota_CYB"
    )

    await message.answer(text=text, parse_mode="MarkdownV2", reply_markup=builder.as_markup())

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
