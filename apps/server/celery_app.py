import os

from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "worker",
    broker=os.getenv("REDIS_URL", "redis://redis:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://redis:6379/0"),
)

celery_app.conf.beat_schedule = {
    "check-satellites-every-minute": {
        "task": "tasks.check_visibillity_and_notify",
        "schedule": crontab(minute="*/1"),
    }
}
