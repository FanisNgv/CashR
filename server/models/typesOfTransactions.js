const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class typesOfTransactions extends Model {}

typesOfTransactions.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userID: {type: DataTypes.INTEGER, allowNull: false, unique: false},
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isIncome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    modelName: 'typesOfTransactions'
});

// Функция для создания набора типов транзакций по умолчанию
async function createDefaultTransactionTypes(userId) {
    try {
        // Создайте набор типов транзакций по умолчанию
        const defaultTransactionTypes = [
            { userID: userId, name: 'Зарплата', isIncome: true },
            { userID: userId, name: 'Стипендия', isIncome: true },
            { userID: userId, name: 'Еда', isIncome: false },
            { userID: userId, name: 'Жилье', isIncome: false },
            { userID: userId, name: 'Здоровье', isIncome: false },
            { userID: userId, name: 'Спорт', isIncome: false },
            { userID: userId, name: 'Транспорт', isIncome: false }
        ];

        // Создайте записи в таблице для каждого типа транзакции по умолчанию
        await typesOfTransactions.bulkCreate(defaultTransactionTypes);
    } catch (error) {
        console.error('Ошибка при создании набора типов транзакций по умолчанию:', error);
    }
}

module.exports = typesOfTransactions;