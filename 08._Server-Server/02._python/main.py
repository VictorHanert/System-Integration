from fastapi import FastAPI
import requests

app = FastAPI()

# In terminal:
# poetry add uvicorn fastapi

# Activate the virtual environment:
# poetry shell

# Start the server:
# uvicorn main:app --reload

@app.get("/fastapiData")
def getFastAPIData():
    return { "data": "Data from FastAPI" }

@app.get("/requestExpressData")
def getRequestExpressData():
    response = requests.get("http://127.0.0.1:8080/expressData")
    data = response.json()
    data['data'] += ' - loaded from other server in FastAPI'
    return data
