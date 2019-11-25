const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const config = require("config");
const port = config.get("PORT");

const app = express();

app.use("/ER-backend/api/v1", (req, res) => {
    res.send("ER-backend");
});

app.listen(port, () => {
    console.log("ER-backend is running on PORT:", port)
});

module.exports = app;