const jwt = require('jsonwebtoken');
const secretKey = require('config').get("SECRET_KEY");
const responseUtil = require("../utils/responses.util");

function verify(req, res, next) {
    const token = req.headers['token'];

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.json(responseUtil.authenticationFail({reason: "token is invalid"}))
            } else {
                req.tokenData = decoded;
                next();
            }
        })
    } else {
        return res.json(responseUtil.authenticationFail({reason: "token is missing"}))
    }
}

module.exports = {verify};