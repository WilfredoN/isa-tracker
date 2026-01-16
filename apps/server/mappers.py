from schemas import UserModel, UserResponse, SatelliteResponse
from db.schema import Satellite as SatelliteModel


def user_to_response(user: UserModel) -> UserResponse:
    return UserResponse(
        id=user.id,
        login=user.login,
        chat_id=user.chat_id,
        latitude=user.latitude,
        longitude=user.longitude,
    )


def satellite_to_response(satellite: SatelliteModel) -> SatelliteResponse:
    return SatelliteResponse(
        id=satellite.id,
        name=satellite.name,
        tle_1=satellite.tle_1,
        tle_2=satellite.tle_2,
        added_at=str(satellite.added_at),
    )
