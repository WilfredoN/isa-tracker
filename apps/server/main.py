import re

from db.database import SessionLocal
from db.schema import Satellite as SatelliteModel
from db.schema import User as UserModel
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import SatelliteCreate, UserBase
from sqlalchemy.orm import Session

app = FastAPI(title="Satellite Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def root():
    return {"status": "for all mankind"}


@app.post("/users")
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.chat_id == user.chat_id).first()
    if db_user:
        db_user.latitude = user.latitude
        db_user.longitude = user.longitude
    else:
        db_user = UserModel(
            chat_id=user.chat_id,
            latitude=user.latitude,
            longitude=user.longitude,
        )
        db.add(db_user)
    db.commit()
    return {"message": f"User with chat_id {user.chat_id} created!"}


@app.delete("/users/{chat_id}")
async def delete_user(chat_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.chat_id == chat_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": f"User with chat_id {chat_id} deleted!"}


@app.post("/satellites")
async def add_satellite(satellite: SatelliteCreate, db: Session = Depends(get_db)):
    db_satellite = (
        db.query(SatelliteModel)
        .filter(
            SatelliteModel.name == satellite.name,
        )
        .first()
    )
    if not db_satellite:
        db_satellite = SatelliteModel(
            name=satellite.name, tle_1=satellite.tle_1, tle_2=satellite.tle_2
        )
        db.add(db_satellite)
        db.flush()
        return {
            "message": f"Satellite {satellite.name} added with ID {db_satellite.id} at {db_satellite.added_at}"
        }

    raise HTTPException(status_code=409, detail="Satellite already exists")


@app.delete(f"/satellites/{id}")
async def delete_satellite(id: int, db: Session = Depends(get_db)):
    db_satellite = db.query(SatelliteModel).filter(SatelliteModel.id == id).first()
    if not db_satellite:
        raise HTTPException(status_code=404, detail="Satellite not found")
    db.delete(db_satellite)
    db.commit()
    return {"message": f"Satellite with ID {id} deleted!"}
