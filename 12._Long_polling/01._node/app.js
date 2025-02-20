import express from 'express';

const app = express();

app.get('/random', (req, res) => {
    const randomNumbers = Math.floor(Math.random() * 9000 + 999);
    res.send({ data: randomNumbers });
});

let clients = [];

app.get('/events/subscribe', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', () => {
        clients.filter((client) => client !== res);
    });
});

app.get('/events/publish', (req, res) => {
    const message = { data: "This a a random number for you: " + Math.floor(Math.random() * 90000 + 999) };

    clients.forEach((res) => {
        res.send(message);
    });

    clients = [];

    // Send a 204 status code to indicate that the request has succeeded, 
    // but the client does not need to navigate away from its current page.
    res.status(204).end();
});


const PORT = 8080;
app.listen(PORT, () => console.log(`Long polling is running on port ${PORT}`));