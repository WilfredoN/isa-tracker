import os

import requests
from celery_app import celery_app
from db.database import SessionLocal
from db.schema import Satellite, User
from skyfield_logic import is_satellite_visible

BOT_TOKEN = os.getenv("TELEGRAM_TOKEN")


@celery_app.task(name="tasks.check_visibillity_and_notify")
def check_visibillity_and_notify():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.chat_id.is_not(None)).first()
        if not user or user.latitude is None or user.longitude is None:
            return
        satellites = db.query(Satellite).all()
        for satellite in satellites:
            currently_visible = is_satellite_visible(
                satellite.tle_1,
                satellite.tle_2,
                user.latitude,
                user.longitude,
                satellite.name,
            )
            was_visible = bool(satellite.is_visible)
            if currently_visible and not was_visible:
                send_telegram_message(
                    user.chat_id, f"🛰 {satellite.name} is visible now!"
                )
                satellite.is_visible = True
                db.commit()
            elif not currently_visible and was_visible:
                send_telegram_message(
                    user.chat_id, f"🛰 {satellite.name} is no longer visible."
                )
                satellite.is_visible = False
                db.commit()
    except Exception as e:
        print(f"Error occurred while checking visibility: {e}")
    finally:
        db.close()


def send_telegram_message(chat_id, message):
    if not BOT_TOKEN:
        raise RuntimeError("TELEGRAM_TOKEN is required for bot notifications")
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    data = {"chat_id": chat_id, "text": message}
    response = requests.post(url, data=data)
    if response.status_code != 200:
        raise Exception(f"Failed to send message to Telegram: {response.text}")
