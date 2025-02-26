import express from "express";

const app = express();

app.use(express.static("public"));

// SERVER-SENT EVENTS
app.get("/synctime", (req, res) => {
  res.writeHead(200, {
    "Connection": "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  setInterval(() => sendTimeToClient(res), 100);
});

function sendTimeToClient(res) {
  const time = new Date().toISOString();
  res.write(`data: ${time} \n\n`);
}

// Der er 3 steder man kan oprette en connection til serveren:
// 1. Fra en browser
// 2. Fra en konsol i browseren
// 3. Fra en API-klient fx. Postman

const PORT = 8080;
app.listen(PORT, () => `Server is running on port ${PORT}`);
