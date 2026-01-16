from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    Index,
    func,
)
from sqlalchemy.orm import Mapped, declarative_base, mapped_column
from sqlalchemy.sql import expression

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    login: Mapped[str] = mapped_column(
        String(128), unique=True, nullable=False, index=True
    )
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    chat_id: Mapped[int] = mapped_column(
        BigInteger, unique=True, nullable=True, index=True
    )
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)


class Satellite(Base):
    __tablename__ = "satellites"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    tle_1: Mapped[str] = mapped_column(Text, nullable=False)
    tle_2: Mapped[str] = mapped_column(Text, nullable=False)
    is_visible: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=expression.false(), default=False
    )
    added_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, server_default=func.now()
    )

    __table_args__ = (
        Index("ix_satellites_name_lower_unique", func.lower(name), unique=True),
    )
