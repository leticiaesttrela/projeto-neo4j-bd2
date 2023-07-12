const express = require('express');
const router = require('./routes/routes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT;

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
});