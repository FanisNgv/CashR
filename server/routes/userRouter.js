const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const {check} = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware")


router.post('/createTransaction', authMiddleware, controller.createTransaction); // это подроут для /user. Т.е. будем иметь .../user/createTransaction
router.get('/getTransactions', authMiddleware, controller.getTransactions);
router.delete('/deleteTransaction/:transactionID', authMiddleware, controller.deleteTransaction);
router.put('/updateTransaction/:transactionID', authMiddleware, controller.updateTransaction)

module.exports = router;