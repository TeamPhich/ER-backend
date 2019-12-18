const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const config = require("config");
const port = config.get("PORT");
const db = require("./models/index");
const accounts = require("./routes/accounts.route");
const students = require("./routes/students.route");
const subjects = require("./routes/subjects.route");
const subjectClasses = require("./routes/subject_classes.route");
const exams = require("./routes/exams.route");

const app = express();

morgan.token('remote-addr', function (req) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

morgan.token('http-version', function (req) {
    return ((req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'] : "");
});

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':remote-addr - [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));
app.use(morgan('combined'));

app.use("/api/v1/subjects", subjects);
app.use("/api/v1/accounts/", accounts);
app.use("/api/v1/students/", students);
app.use("/api/v1/exams/", exams);
app.use("/api/v1/subject-classes/", subjectClasses);

app.use("/api/v1", (req, res) => {
    res.send("ER-backend");
});

db.sequelize.sync()
    .then(() => {
        console.log('Connect database is successfully');
    })
    .catch(err => {
        console.log(err.message);
        process.exit();
    });

app.listen(port, () => {
    console.log("ER-backend is running on PORT:", port)
});

module.exports = app;