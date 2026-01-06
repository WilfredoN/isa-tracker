import os

import requests
from aiogram import Bot, Dispatcher, types

API_URL = os.getenv("API_URL", "http://localhost:8000")
BOT_TOKEN = os.getenv("TELEGRAM_TOKEN", "")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(commands=["start"])
async def start(message: types.Message):
    buttons = [[types.KeyboardButton(text="Share Location", request_location=True)]]
    keyboard = types.ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)
    await message.answer(
        "Share your location to register and track satellites!", reply_markup=keyboard
    )


@dp.message(content_types=["location"])
async def handle_location(message: types.Message):
    if not message.location:
        raise ValueError("Location not provided")

    latitude = message.location.latitude
    longitude = message.location.longitude
    chat_id = message.chat.id

    requests.post(
        f"{API_URL}/users",
        json={"latitude": latitude, "longitude": longitude, "chat_id": chat_id},
    )
    await message.answer(
        f"Location {latitude}, {longitude} registered successfully! For All Mankind."
    )
