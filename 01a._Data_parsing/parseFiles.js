import fs from "fs/promises";
import yaml from "js-yaml";
import xml2js from "xml2js";

const BASE_DIR = "generated_files/";

// Read JSON
const parseJSON = async (file) => JSON.parse(await fs.readFile(BASE_DIR + file, "utf8"));

// Read YAML
const parseYAML = async (file) => yaml.load(await fs.readFile(BASE_DIR + file, "utf8"));

// Read XML
const parseXML = async (file) => {
  const data = await fs.readFile(BASE_DIR + file, "utf8");
  return xml2js.parseStringPromise(data);
};

// Read CSV
const parseCSV = async (file) => {
  const data = await fs.readFile(BASE_DIR + file, "utf8");
  const [header, ...rows] = data.split("\n").filter(Boolean);
  const keys = header.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  });
};

// Read TXT
const parseTXT = async (file) => {
  const data = await fs.readFile(BASE_DIR + file, "utf8");
  return data.split("\n").filter(Boolean).map(JSON.parse);
};

// Printing them all out
(async () => {
  console.log("Parsed JSON:", await parseJSON("dataset.json"));
  console.log("------------------------------------");
  console.log("Parsed YAML:", await parseYAML("dataset.yaml"));
  console.log("------------------------------------");
  console.log("Parsed XML:", JSON.stringify(await parseXML("dataset.xml"), null, 2));
  console.log("------------------------------------");
  console.log("Parsed CSV:", await parseCSV("dataset.csv"));
  console.log("------------------------------------");
  console.log("Parsed TXT:", await parseTXT("dataset.txt"));
})();
