const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config");

const app = express();

app.use("/api/v1", (req, res) => {
    res.send("ER-backend");
});

module.exports = app;