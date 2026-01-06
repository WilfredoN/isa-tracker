from sqlalchemy import (
    BigInteger,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, declarative_base, mapped_column

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    chat_id: Mapped[int] = mapped_column(
        BigInteger, unique=True, nullable=True, index=True
    )
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)


class Satellite(Base):
    __tablename__ = "satellites"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    tle_1: Mapped[str] = mapped_column(Text, nullable=False)
    tle_2: Mapped[str] = mapped_column(Text, nullable=False)
    added_at: Mapped[str] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )
