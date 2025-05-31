import fs from 'fs';

// const response = await fetch("https://www.proshop.dk/Baerbar");
// const result = await response.text();
// fs.writeFileSync("index.html", result);

import { load } from 'cheerio'; // package for parsing and manipulating HTML

const page = fs.readFileSync("index.html", "utf-8");

const $ = load(page);

$("#products [product]").each((index, element) => {
    const price = $(element).find(".site-currency-lg").text();
    const nameAndDescription = $(element).find(".site-product-link").text();

    console.log(price);
    console.log(nameAndDescription.trim());
    console.log("=".repeat(50));
});
