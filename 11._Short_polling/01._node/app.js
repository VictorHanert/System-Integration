import express from "express";

const app = express();

app.use(express.static("public"));

app.get("/random", (req, res) => {
    res.send({ data: randomWord() });
});

const randomWord = () => {
    const fruits = ["apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew", "kiwi", "lemon"];
    const randomNumbers = Math.floor(Math.random() * 10000);
    return fruits[Math.floor(Math.random() * fruits.length)] + randomNumbers;
};


const PORT = 8080;
app.listen(PORT, () => console.log(`${randomWord()} is running on port ${PORT}`));
