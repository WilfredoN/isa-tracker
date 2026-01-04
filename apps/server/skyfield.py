from skyfield.api import Topos, load
from skyfield.iokit import EarthSatellite


def is_satellite_visible(
    tle_1,
    tle_2,
    user_lat,
    user_lon,
    satellite_name="UNNAMED_SATELLITE",
    min_altitude_deg=10,
    check_illumination=False,
):
    timescale = load.timescale()
    time_now = timescale.now()
    planets = load("de421.bsp")
    earth = planets["earth"]

    satellite = EarthSatellite(tle_1, tle_2, satellite_name, timescale)
    observer = earth + Topos(latitude_degrees=user_lat, longitude_degrees=user_lon)

    difference = satellite - observer
    topocentric = difference.at(time_now)
    alt, az, distance = topocentric.altaz()

    visible = alt.degrees > min_altitude_deg

    if check_illumination and visible:
        satellite_at = satellite.at(time_now)
        sunlit = satellite_at.is_sunlit(planets)
        visible = sunlit

    return visible
