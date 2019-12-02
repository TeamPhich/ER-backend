const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

async function importStudents(req,res) {
    try{
        const file = req.file;
        if(!file) throw new Error("File is missing!");
        console.log(file);
        res.json(responseUtil.success({}));
    } catch (err) {
       res.json(responseUtil.fail({reason: err.message}))
    }
}

module.exports = {
    importStudents
};