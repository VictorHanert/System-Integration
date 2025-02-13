// Import necessary modules
import express from "express";
import fs from "fs/promises";
import yaml from "js-yaml";
import xml2js from "xml2js";

const app = express();
const PORT = 3000;
const dataFolder = "generated_files/";

// JSON Parser
const parseJSON = async (file) => JSON.parse(await fs.readFile(file, "utf8"));

// YAML Parser
const parseYAML = async (file) => yaml.load(await fs.readFile(file, "utf8"));

// XML Parser
const parseXML = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return xml2js.parseStringPromise(data);
};

// CSV Parser
const parseCSV = async (file) => {
  const data = await fs.readFile(file, "utf8");
  const [header, ...rows] = data.split("\n").filter(Boolean);
  const keys = header.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  });
};

// TXT Parser
const parseTXT = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return data.split("\n").filter(Boolean).map(JSON.parse);
};

// Endpoints
app.get("/json", async (req, res) => {
  try {
    const data = await parseJSON(`${dataFolder}dataset.json`);
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/yaml", async (req, res) => {
  try {
    const data = await parseYAML(`${dataFolder}dataset.yaml`);
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/xml", async (req, res) => {
  try {
    const data = await parseXML(`${dataFolder}dataset.xml`);
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/csv", async (req, res) => {
  try {
    const data = await parseCSV(`${dataFolder}dataset.csv`);
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/txt", async (req, res) => {
  try {
    const data = await parseTXT(`${dataFolder}dataset.txt`);
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});