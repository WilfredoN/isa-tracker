import requests
from .interface import CloudCoverProvider

class OpenMeteoCloudCoverProvider(CloudCoverProvider):
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    def get_cloud_cover(self, lat: float, lon: float) -> float:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "cloud_cover"
        }
        try:
            response = requests.get(self.BASE_URL, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            return float(data["current"]["cloud_cover"])
        except Exception:
            return -1.0
