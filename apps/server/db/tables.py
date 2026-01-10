import logging
import time

from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from .database import engine
from .schema import Base


logger = logging.getLogger(__name__)


def _wait_for_db(max_retries: int = 10, initial_delay: float = 1.0) -> None:
    delay = initial_delay
    for attempt in range(1, max_retries + 1):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return
        except OperationalError as exc:
            if attempt == max_retries:
                raise exc
            logger.info("Database unavailable, retry %s/%s", attempt, max_retries)
            time.sleep(delay)
            delay *= 1.5


def create_tables():
    _wait_for_db()
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()
