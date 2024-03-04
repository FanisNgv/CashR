// Здесь нужно будет проверить!!! Возможно User/Transactions содержат что-то не то
const User = require('../models/user'); // Необходимо просто написать имя файла, результатом будет то, что вернет этот файл
const Transaction = require('../models/transaction')

User.hasMany(Transaction)
Transaction.belongsTo(User)
