// models_connection.js

const User = require('../models/user');
const Transaction = require('../models/transaction');
const { typesOfTransactions, createDefaultTransactionTypes } = require('../models/typesOfTransactions');

User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(typesOfTransactions);
typesOfTransactions.belongsTo(User);

