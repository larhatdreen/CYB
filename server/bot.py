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
    builder = InlineKeyboardBuilder()
    builder.button(text="Mini App", web_app=WebAppInfo(url="https://c846-178-73-210-47.ngrok-free.app"))
    await message.answer(text="Ссылка", reply_markup=builder.as_markup())

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())