from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["GET"],  # Allows only GET requests
    allow_credentials=True,
    # allow_origins=["*"],  # Allows all origins
)

@app.get("/timestamp")
def timestamp():
    return { "data": datetime.now() }