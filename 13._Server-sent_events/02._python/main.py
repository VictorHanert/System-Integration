from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import StreamingResponse
from datetime import datetime
import asyncio
import random

app = FastAPI()

templates = Jinja2Templates(directory="templates")

@app.get("/")
def serve_root_page(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

async def date_generator():
    while True:
        now = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        yield f"data: {now}\n\n"
        await asyncio.sleep(1)

@app.get("/sse")
def sse():
    return StreamingResponse(date_generator(), media_type="text/event-stream")

# New quote generator
quotes_list = [
    "The best way to predict the future is to invent it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "The only way to do great work is to love what you do.",
    "Success is not the key to happiness. Happiness is the key to success."
]

async def quote_generator():
    while True:
        quote = random.choice(quotes_list)
        yield f"data: {quote}\n\n"
        await asyncio.sleep(1)

# See preview in terminal: 
# Start server: uvicorn main:app --reload
# Start localtunnel: lt --port 8000 --subdomain victor-port
# curl https://victor-port.loca.lt/quotes
@app.get("/quotes")
def quotes():
    return StreamingResponse(quote_generator(), media_type="text/event-stream")