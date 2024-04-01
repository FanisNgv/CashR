const jwt = require('jsonwebtoken')
const {secret} = require("../config");
const config = require('../config.js');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: "Не авторизован"})
        }
        const decoded = jwt.verify(token, config.secret)
        
        if (decoded.exp <= Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ message: "Токен истек" });
        }
        // req.body = decoded
        next()
    } catch (e) {
        res.status(401).json({message: "Не авторизован"})
    }
};