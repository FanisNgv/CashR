const User = require('../models/user'); // Необходимо просто написать имя файла, результатом будет то, что вернет этот файл
const Transaction = require('../models/transaction')
const typesOfTransactions = require('../models/typesOfTransactions')

User.hasMany(Transaction);
Transaction.belongsTo(User, {foreignKey: 'UserID', as: 'User'});

typesOfTransactions.hasMany(Transaction);
Transaction.belongsTo(typesOfTransactions, { foreignKey: 'typeOfTransactionID', as: 'typesOfTransactions' });
