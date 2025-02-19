import express from "express";
import fs from "fs/promises";
import yaml from "js-yaml";
import xml2js from "xml2js";
import morgan from "morgan";

const PORT = 3000;
const SERVER_URL = "http://127.0.0.1:8000";
const DATA_FOLDER = "../generated_files";

// ---------- LOCAL PARSE FUNCTIONS ----------
async function parseJSON() {
  const data = await fs.readFile(`${DATA_FOLDER}/dataset.json`, "utf8");
  return JSON.parse(data);
}

async function parseYAML() {
  const data = await fs.readFile(`${DATA_FOLDER}/dataset.yaml`, "utf8");
  return yaml.load(data);
}

async function parseXML() {
  const data = await fs.readFile(`${DATA_FOLDER}/dataset.xml`, "utf8");
  return xml2js.parseStringPromise(data);
}

async function parseCSV() {
  const data = await fs.readFile(`${DATA_FOLDER}/dataset.csv`, "utf8");
  const [header, ...rows] = data.split("\n").filter(Boolean);
  const keys = header.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  });
}

async function parseTXT() {
  const data = await fs.readFile(`${DATA_FOLDER}/dataset.txt`, "utf8");
  return data.split("\n").filter(Boolean).map(JSON.parse);
}

// ---------- SERVER SETUP ----------
const app = express();

// Use morgan for logging requests
app.use(morgan("dev"));

app.get("/json", async (req, res) => {
  console.log(`Received request: GET /json?local=${req.query.local}`);
  if (req.query.local) {
    try {
      const localData = await parseJSON();
      console.log("Returning local JSON data");
      return res.json({ source: "Node.js Server", data: localData });
    } catch (err) {
      console.error("Error parsing JSON:", err.message);
      return res.status(500).send(err.message);
    }
  } else {
    try {
      const response = await fetch(`${SERVER_URL}/json?local=true`);
      const data = await response.json();
      console.log("Fetched JSON data from Server");
      res.json({ source: "Python Server", data });
    } catch (err) {
      console.error("Error fetching JSON from Server:", err.message);
      res.status(500).send(err.message);
    }
  }
});

app.get("/yaml", async (req, res) => {
  console.log(`Received request: GET /yaml?local=${req.query.local}`);
  if (req.query.local) {
    try {
      const localData = await parseYAML();
      console.log("Returning local YAML data");
      return res.json({ source: "Node.js Server", data: localData });
    } catch (err) {
      console.error("Error parsing YAML:", err.message);
      return res.status(500).send(err.message);
    }
  } else {
    try {
      const response = await fetch(`${SERVER_URL}/yaml?local=true`);
      const data = await response.json();
      console.log("Fetched YAML data from Server");
      res.json({ source: "Python Server", data });
    } catch (err) {
      console.error("Error fetching YAML from Server:", err.message);
      res.status(500).send(err.message);
    }
  }
});

app.get("/xml", async (req, res) => {
  console.log(`Received request: GET /xml?local=${req.query.local}`);
  if (req.query.local) {
    try {
      const localData = await parseXML();
      console.log("Returning local XML data");
      return res.json({ source: "Node.js Server", data: localData });
    } catch (err) {
      console.error("Error parsing XML:", err.message);
      return res.status(500).send(err.message);
    }
  } else {
    try {
      const response = await fetch(`${SERVER_URL}/xml?local=true`);
      const data = await response.json();
      console.log("Fetched XML data from Server");
      res.json({ source: "Python Server", data });
    } catch (err) {
      console.error("Error fetching XML from Server:", err.message);
      res.status(500).send(err.message);
    }
  }
});

app.get("/csv", async (req, res) => {
  console.log(`Received request: GET /csv?local=${req.query.local}`);
  if (req.query.local) {
    try {
      const localData = await parseCSV();
      console.log("Returning local CSV data");
      return res.json({ source: "Node.js Server", data: localData });
    } catch (err) {
      console.error("Error parsing CSV:", err.message);
      return res.status(500).send(err.message);
    }
  } else {
    try {
      const response = await fetch(`${SERVER_URL}/csv?local=true`);
      const data = await response.json();
      console.log("Fetched CSV data from Server");
      res.json({ source: "Python Server", data });
    } catch (err) {
      console.error("Error fetching CSV from Server:", err.message);
      res.status(500).send(err.message);
    }
  }
});

app.get("/txt", async (req, res) => {
  console.log(`Received request: GET /txt?local=${req.query.local}`);
  if (req.query.local) {
    try {
      const localData = await parseTXT();
      console.log("Returning local TXT data");
      return res.json({ source: "Node.js Server", data: localData });
    } catch (err) {
      console.error("Error parsing TXT:", err.message);
      return res.status(500).send(err.message);
    }
  } else {
    try {
      const response = await fetch(`${SERVER_URL}/txt?local=true`);
      const data = await response.json();
      console.log("Fetched TXT data from Server");
      res.json({ source: "Python Server", data });
    } catch (err) {
      console.error("Error fetching TXT from Server:", err.message);
      res.status(500).send(err.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server A running at http://localhost:${PORT}`);
});
