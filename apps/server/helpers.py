from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from db.schema import User as UserModel, Satellite as SatelliteModel


def not_found_response(entity: str, id: int | str) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"error": {"message": f"{entity} {id} not found", "code": 404}},
    )


def hash_password(password: str) -> str:
    import bcrypt

    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    import bcrypt

    return bcrypt.checkpw(plain.encode(), hashed.encode())


def get_user_by_id(db: Session, id: int) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.id == id).first()


def get_user_by_login(db: Session, login: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.login == login).first()


def get_satellite_by_id(db: Session, id: int) -> SatelliteModel | None:
    return db.query(SatelliteModel).filter(SatelliteModel.id == id).first()
