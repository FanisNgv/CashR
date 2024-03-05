const Router = require('express');
const router = new Router();
const controller = require('../controllers/userController');
const {check} = require("express-validator");

router.post('/createTransaction', controller.createTransaction); // это подроут для /user. Т.е. будем иметь .../user/createTransaction
router.get('/getTransactions', controller.getTransactions);
router.delete('/deleteTransaction/:transactionID', controller.deleteTransaction);
router.put('/updateTransaction/:transactionID', controller.updateTransaction)

module.exports = router;