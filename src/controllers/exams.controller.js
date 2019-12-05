const db = require("../models/index");
const responseUtil = require("../utils/responses.util");

async function create(req,res) {
    const {id, name} = req.body;
    try {
        if(!id) throw new Error("id fields is missing");
        if(!name) throw new Error("name field is missing");
        res.json(responseUtil.success({data: {}}))
    } catch (err) {
        res.json(responseUtil.fail({reason: err.message}));
    }
}

module.exports = {
    create
};