from pydantic import BaseModel


class SatelliteCreate(BaseModel):
    name: str
    tle_1: str
    tle_2: str


class UserBase(BaseModel):
    chat_id: int
    latitude: float
    longitude: float
