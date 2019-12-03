const db = require("../models/index");
const responseUtil = require("../utils/responses.util");
const excelToJson = require("convert-excel-to-json");
const bcrypt = require("bcrypt");
const fs = require("fs");

async function importStudents(req, res) {
    try {
        if (!req.file) throw new Error("File is missing!");
        const filePath = req.file.path;
        let studentsSheetJSON = excelToJson({
            sourceFile: filePath,
            columnToKey: {
                A: 'MSSV',
                B: 'fullname',
                C: 'birthday'
            }
        });
        const firstSheetName = Object.keys(studentsSheetJSON)[0];
        const studentsJSON = studentsSheetJSON[firstSheetName].slice(1, studentsSheetJSON[firstSheetName].length);
        studentsJSON.map(student => {
            student.birthday = new Date(student.birthday).getTime() / 1000;
        });
        let existedStudents = [];
        for (let student of studentsJSON) {
            const existedStudent = await db.accounts.findAll({
                where: {
                    user_name: student.MSSV
                }
            });
            if (existedStudent.length) existedStudents.push({MSSV: student.MSSV})
        }
        if (existedStudents.length) throw new Error(JSON.stringify("sinh viên đã tồn tại:" + JSON.stringify(existedStudents)));

        for (let student of studentsJSON) {
            let salt = await bcrypt.genSalt(10);
            let {MSSV, fullname, birthday} = student;
            let hashPassword = await bcrypt.hash(MSSV.toString(), salt);
            await db.accounts.create({
                user_name: MSSV,
                password: hashPassword,
                fullname,
                birthday: birthday,
                role_id: 2
            });
        }
        fs.unlinkSync(filePath);
        res.json(responseUtil.success({data: {}}));
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

async function getInfomation(req, res) {
    try {
        const students = await db.accounts.findAll({
            where: {
                role_id: 2
            }
        });
        for (let i = 0; i < students.length; i++) {
            const data = students[i].dataValues;
            students[i] = {
                id: students[i].id,
                user_name: data.user_name,
                fullname: data.fullname,
                email: data.email,
                birthday: data.birthday
            }
        }
        res.json(responseUtil.success({data: {students}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

// async function putInformation(req, res) {
//     try {
//         const
//         res.json(responseUtil.success({data: {}}))
//     } catch (err) {
//         res.json(responseUtil.fail({reason: err.message}))
//     }
// }

async function deleteStudent(req, res) {
    const {student_id} = req.params;
    try {
        const isStudent = await db.accounts.findAll({
            where:{
                id: student_id,
                role_id: 2
            }
        });
        if(!isStudent.length) throw new Error("student is invalid");
        await db.accounts.destroy({
            where:{
                id: student_id
            }
        });
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}))
    }
}

module.exports = {
    importStudents,
    getInfomation,
    // putInformation,
    deleteStudent
};