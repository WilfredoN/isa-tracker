from types.satellite import Satellite

from fastapi import FastAPI

app = FastAPI(title="Satellite Tracker API")


@app.get("/")
async def root():
    return {"status": "for all mankind"}


@app.post("/satellites/add")
async def ad_satellite(satellite: Satellite):
    return {"message": f"Satellite {satellite.name} added"}
