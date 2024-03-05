const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db'); // Предполагается, что ваш экземпляр Sequelize называется "sequelize"

class Transaction extends Model {}

Transaction.init({
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userID: { type: DataTypes.INTEGER, allowNull: false },
    come: { type: DataTypes.STRING, allowNull: false },
    valueOfTransaction: DataTypes.DECIMAL(10, 2),
    typeOfTransaction: { type: DataTypes.STRING, allowNull: false },
    dateOfTransaction: { type: DataTypes.DATE, allowNull: false }
}, {
    sequelize,
    modelName: 'Transaction'
});

module.exports = Transaction;