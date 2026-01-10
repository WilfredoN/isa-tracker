from abc import ABC, abstractmethod

class CloudCoverProvider(ABC):
    @abstractmethod
    def get_cloud_cover(self, lat: float, lon: float) -> float:
        """
        Returns the cloud cover percentage (0-100) for the given coordinates.
        """
        pass
