from fastapi import FastAPI, HTTPException
import requests
import json
import csv
import yaml
import xmltodict
from pathlib import Path

app = FastAPI()

NODE_SERVER_URL = "http://127.0.0.1:3000"  # Node.js server
DATA_FOLDER = Path("../generated_files")  # Common folder for data files

# ---------------------------
# LOCAL PARSE FUNCTIONS
# ---------------------------
def parse_json():
    file_path = DATA_FOLDER / "dataset.json"
    with file_path.open("r", encoding="utf-8") as f:
        return json.load(f)

def parse_yaml():
    file_path = DATA_FOLDER / "dataset.yaml"
    with file_path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def parse_xml():
    file_path = DATA_FOLDER / "dataset.xml"
    with file_path.open("r", encoding="utf-8") as f:
        return xmltodict.parse(f.read())

def parse_csv():
    file_path = DATA_FOLDER / "dataset.csv"
    with file_path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

def parse_txt():
    file_path = DATA_FOLDER / "dataset.txt"
    data_list = []
    with file_path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                data_list.append(json.loads(line))
    return data_list

# ---------------------------
# ENDPOINTS
# ---------------------------
@app.get("/json")
def get_json(local: bool = False):
    if local:
        return parse_json()
    else:
        try:
            resp = requests.get(f"{NODE_SERVER_URL}/json?local=true")
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/yaml")
def get_yaml(local: bool = False):
    if local:
        return parse_yaml()
    else:
        try:
            resp = requests.get(f"{NODE_SERVER_URL}/yaml?local=true")
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/xml")
def get_xml(local: bool = False):
    if local:
        return parse_xml()
    else:
        try:
            resp = requests.get(f"{NODE_SERVER_URL}/xml?local=true")
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/csv")
def get_csv(local: bool = False):
    if local:
        return parse_csv()
    else:
        try:
            resp = requests.get(f"{NODE_SERVER_URL}/csv?local=true")
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/txt")
def get_txt(local: bool = False):
    if local:
        return parse_txt()
    else:
        try:
            resp = requests.get(f"{NODE_SERVER_URL}/txt?local=true")
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=str(e))
