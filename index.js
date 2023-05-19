const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.Port || 4000;

const toyInfo = require("./data/toys.json");

app.get("/", (req, res) => {
    res.send(toyInfo);
});

app.listen(port, () => {
    console.log(`My toy website is Running on Port: ${port}`);
});