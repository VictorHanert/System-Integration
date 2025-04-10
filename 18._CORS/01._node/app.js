import express from "express";
const app = express();

import cors from "cors";

// -- Globalt CORS som gælder på alle routes:
// app.use(cors());

// Kun på GET metode:
app.use(cors({
    methods: ["GET"],
}));


// Manuelt sætte CORS headers:
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Specifik CORS til et enkelt endpoint:
app.get("/timestamp", cors(), (req, res) => {
  res.send({ data: new Date() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
