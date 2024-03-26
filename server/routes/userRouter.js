const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const {check} = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware")

<<<<<<< HEAD

router.post('/createTransaction', authMiddleware, controller.createTransaction); // это подроут для /user. Т.е. будем иметь .../user/createTransaction
router.get('/getTransactions', authMiddleware, controller.getTransactions);
router.delete('/deleteTransaction/:transactionID', authMiddleware, controller.deleteTransaction);
router.put('/updateTransaction/:transactionID', authMiddleware, controller.updateTransaction);
router.get('/getTypesOfTransactions', authMiddleware, controller.getTypesOfTransactions);
=======
router.post('/createTransaction', controller.createTransaction); // это подроут для /user. Т.е. будем иметь .../user/createTransaction
router.get('/getTransactions', controller.getTransactions);
router.delete('/deleteTransaction/:transactionID', controller.deleteTransaction);
>>>>>>> c55257bca6f830e073b8803cc16b72c6d6f155a2

module.exports = router;