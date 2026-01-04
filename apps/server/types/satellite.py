from pydantic import BaseModel


class Satellite(BaseModel):
    name: str
    tle_line1: str
    tle_line2: str
