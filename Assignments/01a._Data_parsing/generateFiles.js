import fs from "fs/promises";
import yaml from "js-yaml";

const dataset = [
  {
    name: "Apple",
    country: "USA",
    it_areas: ["Smartphones", "Laptops", "Tablets", "Wearables", "Cloud Services"],
  },
  {
    name: "Samsung",
    country: "South Korea",
    it_areas: ["Smartphones", "Tablets", "TVs", "Semiconductors", "Wearables"],
  },
  {
    name: "Microsoft",
    country: "USA",
    it_areas: ["Software", "Cloud Services", "Gaming", "Laptops", "AI"],
  },
  {
    name: "Huawei",
    country: "China",
    it_areas: ["Smartphones", "Networking Equipment", "Tablets", "AI", "Cloud Services"],
  },
  {
    name: "Sony",
    country: "Japan",
    it_areas: ["Gaming", "TVs", "Cameras", "Smartphones", "Audio Equipment"],
  },
];

// Convert dataset to various formats
const toCSV = (data) => {
  const headers = "name,country,it_areas\n";
  const rows = data.map(
    (entry) => `${entry.name},${entry.country},"${entry.it_areas.join(";")}"`
  );
  return headers + rows.join("\n");
};

const toXML = (data) =>
  `<brands>\n${data
    .map(
      (entry) =>
        `  <brand>
    <name>${entry.name}</name>
    <country>${entry.country}</country>
    <it_areas>${entry.it_areas.join(", ")}</it_areas>
  </brand>`
    )
    .join("\n")}\n</brands>`;

async function writeFiles() {
  await fs.writeFile("dataset.json", JSON.stringify(dataset, null, 2));
  await fs.writeFile("dataset.yaml", yaml.dump(dataset));
  await fs.writeFile("dataset.xml", toXML(dataset));
  await fs.writeFile("dataset.csv", toCSV(dataset));
  await fs.writeFile("dataset.txt", dataset.map((d) => JSON.stringify(d)).join("\n"));

  console.log("Files created!");
}

writeFiles();
