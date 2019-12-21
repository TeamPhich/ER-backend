const db = require("../models/index");
const Op = db.Sequelize.Op;

async function deleteExamSubjects(exam_subjects) {
    try {
        await db.students.destroy({
            where: {
                exam_subject_id: {
                    [Op.in]: exam_subjects
                }
            }
        });

        await db.shift_room.destroy({
            where: {
                exam_subject_id: {
                    [Op.in]: exam_subjects
                }
            }
        });

        await db.exam_subjects.destroy({
            where: {
                id: {
                    [Op.in]: exam_subjects
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
        await db.shifts.destroy({
            where: {
                exam_id
            }
        });
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

async function deleteSubject(subject_id) {
    try {
        let examSubjects = await db.exam_subjects.findAll({
            where: {
                subject_id
            }
        });
        for (let i = 0; i < examSubjects.length; i++) {
            examSubjects[i] = examSubjects[i].dataValues.id
        }
        await deleteExamSubjects(examSubjects);
        await db.subjects.destroy({
            where: {
                subject_id
            }
        })
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteShift(shift_id) {
    try {
        const shiftRooms = await db.shift_room.findAll({
            where: {
                shift_id
            }
        });
        for (let i = 0; i < shiftRooms.length; i++){
            shiftRooms[i] = shiftRooms[i].dataValues.id
        }
        await deleteShiftRoom(shiftRooms);
        await db.shifts.destroy({
            where: {
                id: shift_id
            }
        })
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    deleteExamSubjects,
    deleteShiftRoom,
    deleteShift,
    deleteExam,
    deleteRooms,
    deleteSubject
};