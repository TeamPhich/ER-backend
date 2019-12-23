const app = require("./src/index");
const server = require("http").createServer(app);
const config = require("config");
const jwt = require("jsonwebtoken");
const db = require("./src/models/index");
const responseUtil = require("./src/utils/responses.util");
const Op = db.Sequelize.Op;

const port = config.get("PORT");
const secretkey = config.get("SECRET_KEY");

let io = require("socket.io")(server);

async function registShiftRoom(shift_room_id, account_id, student_id) {
    try {
        const existedStudent = await db.students.findAll({
            where: {
                id: student_id,
                account_id,
                enoughCondition: 1,
                shift_room: {
                    [Op.eq]: null
                }
            },
        });
        if (!existedStudent.length) throw new Error("student isn't existed or registed");
        const exam_subject_id = existedStudent[0].dataValues.exam_subject_id;
        const existedShiftRoom = await db.shift_room.findAll({
            where: {
                id: shift_room_id,
                exam_subject_id
            }
        });
        if (!existedShiftRoom.length) throw new Error("shift room isn't existed");
        let {room_id, current_slot} = existedShiftRoom[0].dataValues;
        const room = await db.rooms.findAll({
            where: {
                id: room_id
            }
        });
        const roomMaxSlot = room[0].dataValues.slot;
        if (current_slot >= roomMaxSlot) throw new Error("slot which in room is full");
        current_slot++;
        await db.shift_room.update({
            current_slot: current_slot
        }, {
            where: {
                id: shift_room_id
            }
        });
        await db.students.update({
            shift_room: shift_room_id
        }, {
            where: {
                id: student_id
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

async function removingShiftRoom(shift_room_id, account_id, student_id) {
    try {
        const existedStudent = await db.students.findAll({
            where: {
                id: student_id,
                account_id,
                enoughCondition: 1,
                shift_room: {
                    [Op.eq]: shift_room_id
                }
            },
        });
        if (!existedStudent.length) throw new Error("student isn't existed or registed");
        const exam_subject_id = existedStudent[0].dataValues.exam_subject_id;
        const existedShiftRoom = await db.shift_room.findAll({
            where: {
                id: shift_room_id,
                exam_subject_id
            }
        });
        if (!existedShiftRoom.length) throw new Error("shift room isn't existed");
        let {current_slot} = existedShiftRoom[0].dataValues;
        if(current_slot === 0) throw new Error("slot is zero");
        current_slot--;
        await db.shift_room.update({
            current_slot: current_slot
        }, {
            where: {
                id: shift_room_id
            }
        });
        await db.students.update({
            shift_room: null
        }, {
            where: {
                id: student_id
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

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
            if (!exams.length) return next(new Error("exam isn't existed"));
            let exam_subjects = await db.exam_subjects.findAll({
                where: {
                    exam_id
                },
                include: {
                    model: db.students,
                    group: ["exam_subject_id"],
                    where: {
                        account_id: decoded.id
                    }
                }
            });
            for (let i = 0; i < exam_subjects.length; i++) {
                exam_subjects[i] = exam_subjects[i].dataValues.id;
            }
            socket.exam_subjects = exam_subjects;
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
    let examSubjectRegistFlag = false;
    const account_id = socket.tokenData.id;
    for (let i = 0; i < socket.exam_subjects.length; i++) {
        socket.join(socket.exam_subjects[i]);
    }

    let checkStartTime = setInterval(() => {
        const now = Date.now() / 1000;
        if (socket.start_time <= now && !startRegistFlag) {
            socket.emit("registing.time.start");
            startRegistFlag = true;
        }
        if ((socket.start_time - now <= 15 * 60 && !examSubjectRegistFlag) && !startRegistFlag) {
            socket.emit("exam_subject.time.read");
            examSubjectRegistFlag = true
        }
        if (socket.finish_time <= now && !finishRegistFlag) {
            socket.emit("registing.time.finish");
            startRegistFlag = false;
            finishRegistFlag = true;
            clearInterval(checkStartTime);
        }
    }, 50);

    socket.on("shift_room.resgisting", async (data) => {
        try {
            if (socket.start_time && !socket.finish_time)
                throw new Error("Ngoài thời hạn đăng kí");
            let {shift_room_id, student_id, exam_subject_id} = data;
            exam_subject_id = exam_subject_id.toString();
            if (socket.exam_subjects.includes(exam_subject_id)) throw new Error("exam_subject_id isn't existed");

            await registShiftRoom(shift_room_id, account_id, student_id);
            socket.emit("shift_room.resgisting.success", responseUtil.success({data: {}}));
            socket.emit("exam_subject.update", {exam_subject_id, shift_room_id});
            socket.to(exam_subject_id).emit("exam_subject.update", {exam_subject_id, shift_room_id});
        } catch (err) {
            socket.emit("shift_room.resgisting.err", responseUtil.fail({reason: err.message}))
        }
    });

    socket.on("shift_room.removing", async (data) => {
        try {
            if (socket.start_time && !socket.finish_time)
                throw new Error("Ngoài thời hạn đăng kí");
            let {shift_room_id, student_id, exam_subject_id} = data;
            exam_subject_id = exam_subject_id.toString();
            if(socket.exam_subjects.includes(exam_subject_id))
                throw new Error("exam_subject_id isn't existed");
            await removingShiftRoom(shift_room_id, account_id, student_id);
            socket.emit("shift_room.removing.success", responseUtil.success({data: {}}));
            socket.emit("exam_subject.update", {exam_subject_id, shift_room_id});
            socket.to(exam_subject_id).emit("exam_subject.update", {exam_subject_id, shift_room_id});
        } catch (err) {
            socket.emit("shift_room.removing.err", responseUtil.fail({reason: err.message}))
        }
    });

    socket.on("current-slot.shift-room.get", async (data) => {
        try {
            if (socket.start_time && !socket.finish_time)
                throw new Error("Ngoài thời hạn đăng kí");
            const {shift_room_id} = data;
            if (!shift_room_id) throw new Error("missing shift_room_id");
            const shift_room = await db.shift_room.findAll({
                where: {id: shift_room_id}
            });
            if (!shift_room.length) throw new Error("shift_room isn't exsited");
            const {current_slot} = shift_room[0].dataValues;
            socket.emit("current-slot.shift-room.post", {current_slot, shift_room_id});
        } catch (err) {
            socket.emit("current-slot.shift-room.err", responseUtil.fail({reason: err.message}));
        }
    })
});

server.listen(port, () => {
    console.log("server is running on port: ", port);
});

module.exports = server;

