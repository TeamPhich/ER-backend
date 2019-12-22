const app = require("./src/index");
const server = require("http").createServer(app);
const config = require("config");
const jwt = require("jsonwebtoken");
const db = require("./src/models/index");

const port = config.get("PORT");
const secretkey = config.get("SECRET_KEY");

const io = require("socket.io")(server);

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        const {token, exam_id} = socket.handshake.query;
        if (!exam_id) return next(new Error('missing group_id'));
        jwt.verify(token, secretkey, async (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error'));
            }
            socket.tokenData = decoded;
            socket.exam_id = exam_id;
            const exams = await db.exams.findAll({
                where: {
                    id: exam_id
                }
            });
            if(!exams.length) return next(new Error("exam isn't existed"));
            socket.start_time = exams[0].dataValues.start_time;
            socket.finish_time = exams[0].dataValues.finish_time;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
}).on("connection", async (socket) => {
    let startRegistFlag = false;
    let finishRegistFlag = false;
    console.log("socket ok");

    let checkStartTime = setInterval(() => {
        const now = Date.now();
        if(socket.start_time >= now){
            socket.emit("registing.time.start");
            startRegistFlag = true;
        }
        if(now >= socket.finish_time){
            socket.emit("registing.time.finish");
            startRegistFlag = false;
            finishRegistFlag = true;
            clearInterval(checkStartTime);
        }
    }, 1000);

});

server.listen(port, () => {
    console.log("server is running on port: ", port);
});

module.exports = server;

