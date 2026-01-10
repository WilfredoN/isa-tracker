import asyncio
import os
from typing import Final

import requests
from requests import RequestException
from aiogram import Bot, Dispatcher, F, types
from aiogram.filters import Command
from aiogram.types import Message


def _prepare_api_url(raw_url: str | None) -> str:
    url = raw_url or "http://api:8000"
    if not url.startswith(("http://", "https://")):
        url = f"http://{url}"
    return url.rstrip("/")


API_URL = _prepare_api_url(os.getenv("API_URL"))
BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")

if not BOT_TOKEN:
    raise RuntimeError("TELEGRAM_TOKEN environment variable is required")


LOCATION_PROMPT: Final[str] = (
    "Share your location to register and track satellites. Use the button below or "
    "send a pinned location via the 📎 attachment menu."
)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


def _post_location(payload: dict[str, float | int]) -> None:
    response = requests.post(
        f"{API_URL}/users",
        json=payload,
        timeout=10,
    )
    response.raise_for_status()


def _location_keyboard() -> types.ReplyKeyboardMarkup:
    buttons = [[types.KeyboardButton(text="Share Location", request_location=True)]]
    return types.ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)


async def _prompt_for_location(message: Message) -> None:
    await message.answer(LOCATION_PROMPT, reply_markup=_location_keyboard())


@dp.message(Command("start"))
async def start(message: Message):
    await _prompt_for_location(message)


@dp.message(Command("location"))
async def request_location(message: Message):
    await _prompt_for_location(message)


@dp.message(F.location)
async def handle_location(message: Message):
    location = message.location
    if not location:
        return
    payload = {
        "latitude": location.latitude,
        "longitude": location.longitude,
        "chat_id": message.chat.id,
    }
    try:
        await asyncio.to_thread(_post_location, payload)
    except RequestException:
        await message.answer("Could not save your location. Please try again soon.")
        return
    await message.answer(
        f"Location {location.latitude:.4f}, {location.longitude:.4f} registered successfully!"
    )


async def main():
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
