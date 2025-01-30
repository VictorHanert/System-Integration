import json
import yaml
import xml.etree.ElementTree as ET
import csv

BASE_DIR = "generated_files/"

# Read JSON
def parse_json(file):
    with open(BASE_DIR + file, "r", encoding="utf-8") as f:
        return json.load(f)

# Read YAML
def parse_yaml(file):
    with open(BASE_DIR + file, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

# Read XML
def parse_xml(file):
    tree = ET.parse(BASE_DIR + file)
    root = tree.getroot()
    
    def parse_element(element):
        return {child.tag: parse_element(child) if len(child) else child.text for child in element}
    
    return parse_element(root)

# Read CSV
def parse_csv(file):
    with open(BASE_DIR + file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

# Read TXT (assuming JSON lines)
def parse_txt(file):
    with open(BASE_DIR + file, "r", encoding="utf-8") as f:
        return [json.loads(line.strip()) for line in f if line.strip()]

# Printing them all out
if __name__ == "__main__":
    print("Parsed JSON:", parse_json("dataset.json"))
    print("------------------------------------")
    print("Parsed YAML:", parse_yaml("dataset.yaml"))
    print("------------------------------------")
    print("Parsed XML:", json.dumps(parse_xml("dataset.xml"), indent=2))
    print("------------------------------------")
    print("Parsed CSV:", parse_csv("dataset.csv"))
    print("------------------------------------")
    print("Parsed TXT:", parse_txt("dataset.txt"))
