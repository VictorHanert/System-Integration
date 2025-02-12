from fastapi import FastAPI
import json
import yaml
import xmltodict
import csv
from fastapi.responses import JSONResponse, HTMLResponse

app = FastAPI()

BASE_DIR = "generated_files/"

# Read JSON
def parse_json():
    with open(BASE_DIR + "dataset.json", "r", encoding="utf-8") as f:
        return json.load(f)

# Read YAML
def parse_yaml():
    with open(BASE_DIR + "dataset.yaml", "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

# Read XML
def parse_xml():
    with open(BASE_DIR + "dataset.xml", "r", encoding="utf-8") as f:
        return xmltodict.parse(f.read())

# Read CSV
def parse_csv():
    with open(BASE_DIR + "dataset.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

# Read TXT (assuming JSON lines)
def parse_txt():
    with open(BASE_DIR + "dataset.txt", "r", encoding="utf-8") as f:
        return [json.loads(line.strip()) for line in f if line.strip()]

@app.get("/")
async def root():
    html_content = """
    <html>
        <head>
            <title>Data Parsing Server</title>
        </head>
        <body>
            <h1>Available Endpoints</h1>
            <ul>
                <li><a href="/json">JSON Data</a></li>
                <li><a href="/yaml">YAML Data</a></li>
                <li><a href="/xml">XML Data</a></li>
                <li><a href="/csv">CSV Data</a></li>
                <li><a href="/txt">TXT Data</a></li>
            </ul>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/json")
async def get_json():
    return parse_json()

@app.get("/yaml")
async def get_yaml():
    return parse_yaml()

@app.get("/xml")
async def get_xml():
    data = parse_xml()
    return JSONResponse(content=data)

@app.get("/csv")
async def get_csv():
    return parse_csv()

@app.get("/txt")
async def get_txt():
    return parse_txt()
