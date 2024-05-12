const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const {check} = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware")


router.post('/createTransaction', authMiddleware, controller.createTransaction); // это подроут для /user. Т.е. будем иметь .../user/createTransaction
router.post('/getTransactions', authMiddleware, controller.getTransactions);
router.put('/deleteTransaction', authMiddleware, controller.deleteTransaction);
router.put('/updateTransaction', authMiddleware, controller.updateTransaction);
router.post('/getTypesOfTransactions', authMiddleware, controller.getTypesOfTransactions);
router.post('/getAllTransactions', authMiddleware, controller.getAllTransactions);
router.post('/updateUser', authMiddleware, controller.updateUser);
router.post('/deleteCategory', authMiddleware, controller.deleteCategory);
router.post('/createCategory', authMiddleware, controller.createCategory);

module.exports = router;