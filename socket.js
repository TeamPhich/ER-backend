const app = require("./src/index");
const server = require("http").createServer(app);
const config = require("config");
const jwt = require("jsonwebtoken");
const db = require("./src/models/index");

const port = config.get("PORT");
const secretkey = config.get("SECRET_KEY");

const io = require("socket.io")(server);

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.spaceToken) {
        const {token, exam_id} = socket.handshake.query;
        if(!exam_id) return next(new Error('missing e'));
        jwt.verify(token, secretkey, (err, decoded) => {
            if (err) return next(new Error('Authentication error'));
            socket.tokenData = decoded;
            socket.exam_id = exam_id;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on("connection", (socket) => {
    console.log("ok")
});

server.listen(port, () => {
    console.log("server is running on port: ", port);
});


module.exports = app;

