const db = require("../models/index");
const Op = db.Sequelize.Op;

async function deleteExamSubjects(exam_subject_id) {
    try {
        await db.students.destroy({
            where: {
                exam_subject_id: {
                    [Op.in]: exam_subject_id
                }
            }
        });

        await db.shift_room.destroy({
            where: {
                exam_subject_id: {
                    [Op.in]: exam_subject_id
                }
            }
        });

        await db.exam_subjects.destroy({
            where: {
                id: {
                    [Op.in]: exam_subject_id
                }
            }
        });
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteShiftRoom(shifts_rooms_id) {
    try {
        await db.students.destroy({
            where: {
                shift_room: {
                    [Op.in]: shifts_rooms_id
                }
            }
        });

        await db.shift_room.destroy({
            where: {
                id: {
                    [Op.in]: shifts_rooms_id
                }
            }
        })
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteExam(exam_id) {
    try {
        let examSubjects = await db.exam_subjects.findAll({
            where: {
                exam_id
            },
            attributes: ["id"]
        });
        for (let i = 0; i < examSubjects.length; i++) {
            examSubjects[i] = examSubjects[i].dataValues.id;
        }
        await deleteExamSubjects(examSubjects);
        await db.exams.destroy({
            where: {
                id: exam_id
            }
        })
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteRooms(room_id) {
    try {
        let shiftRoom = await db.shift_room.findAll({
            where: {
                room_id
            }
        });
        for (let i = 0; i < shiftRoom.length; i++) {
            shiftRoom[i] = shiftRoom[i].dataValues.id;
        }
        await deleteShiftRoom(shiftRoom);
        await db.rooms.destroy({
            where: {
                id: room_id
            }
        })
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    deleteExamSubjects,
    deleteShiftRoom,
    deleteExam,
    deleteRooms
};