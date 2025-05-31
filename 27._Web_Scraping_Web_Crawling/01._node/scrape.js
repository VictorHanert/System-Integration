import fs from 'fs';
import { load } from 'cheerio'; // package for parsing and manipulating HTML

const page = fs.readFileSync("proshop.html", "utf-8");

const $ = load(page);

$("#products [product]").each((index, element) => {
    const price = $(element).find(".site-currency-lg").text();
    const nameAndDescription = $(element).find(".site-product-link").text();

    console.log(price);
    console.log(nameAndDescription.trim());
    console.log("=".repeat(50));
});

