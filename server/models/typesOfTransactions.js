const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class typesOfTransactions extends Model {}

typesOfTransactions.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isIncome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, {
    sequelize,
    modelName: 'typesOfTransactions'
});

// Заполнение таблицы значениями по умолчанию
const defaultTransactionTypes = [
    { name: 'Еда', isIncome: false },
    { name: 'Жилье', isIncome: false },
    { name: 'Здоровье', isIncome: false },
    { name: 'Спорт', isIncome: false },
    { name: 'Транспорт', isIncome: false },
    { name: 'Зарплата', isIncome: true },
    { name: 'Стипендия', isIncome: true },
    { name: 'Перевод', isIncome: true }
];

defaultTransactionTypes.forEach(async type => {
    await typesOfTransactions.findOrCreate({ where: { name: type.name }, defaults: { isIncome: type.isIncome } });
});

module.exports = typesOfTransactions;
