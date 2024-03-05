const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const {check} = require("express-validator");

router.post('/registration',[
    check('firstName', "Имя пользователя не может быть пустым!").notEmpty(),
    check('lastName', "Фамилия пользователя не может быть пустым!").notEmpty(),
    check('email', "Почта не может быть пустым!").notEmpty(),
    check('password', "Пароль должен содержать не менее 4-ех и не более 10-и символов!").isLength({min:4, max:10})
], controller.registration);
router.post('/login', controller.login);
router.get('/user', controller.getUser);

module.exports = router;