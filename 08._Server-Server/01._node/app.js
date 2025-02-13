import express from 'express';

// intialiserer express
const app = express();

// definerer en route
app.get('/expressData', (req, res) => {
    res.send({ data: 'Data from Express' });
});

// serveren sender en request til en anden server
app.get('/requestFastAPIData', async (req, res) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/fastapiData');
    const result = await response.json();
    res.send({ data: result.data + ' - loaded from other server in Express' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch data from FastAPI' });
  }
});

app.get('/names/:name', (req, res) => {
  console.log(req.params.name);
  res.send({ data: `Your name is ${req.params.name}` });
});

// sætter serveren til at lytte på port 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
