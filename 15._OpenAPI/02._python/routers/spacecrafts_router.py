from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class Spacecraft(BaseModel):
    id: int
    name: str

class SpacecraftRequestModel(BaseModel):
    id: int

spacecrafts = [
    Spacecraft(id=1, name="Apollo 13"),
    Spacecraft(id=2, name="Challenger"),
    Spacecraft(id=3, name="X-Wing"),
    Spacecraft(id=4, name="Millennium Falcon"),
]

@router.get("/api/spacecrafts/", tags=["spacecrafts"], response_model=list[Spacecraft])
def get_spacecrafts():
    return spacecrafts

@router.get("/api/spacecrafts/{spacecraft_id}", tags=["spacecrafts"], response_model=Spacecraft)
def get_spacecraft_by_id(spacecraft_id: int):
    for spacecraft in spacecrafts:
        if spacecraft.id == spacecraft_id:
            return spacecraft
    raise HTTPException(status_code=404, detail="Spacecraft not found")
        
@router.post("/api/spacecrafts/", tags=["spacecrafts"], response_model=Spacecraft)
def create_spacecraft(spacecraft: Spacecraft):
    spacecrafts.append(spacecraft)
    return spacecraft