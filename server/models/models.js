const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db'); // Предполагается, что ваш экземпляр Sequelize называется "sequelize"

const User = sequelize.define({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.FLOAT, allowNull: false }
});

const Transaction = sequelize.define({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userID: { type: DataTypes.INTEGER, allowNull: false },
    come: {
        type: DataTypes.STRING, allowNull: false, validate: {
            isIn: [['Income', 'Outcome']]
        }
    },
    valueOfTransaction: DataTypes.DECIMAL(10, 2),
    typeOfTransaction: { type: DataTypes.STRING, allowNull: false },
    dateOfTransaction: { type: DataTypes.DATE, allowNull: false }
});

const transLimitations = sequelize.define({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    typeOfTransID: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    userID: { type: DataTypes.INTEGER, allowNull: false },
    limitationValue: {
        type: DataTypes.FLOAT, allowNull: false, unique: false
    }
});

const typesOfTransactions = sequelize.define({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userID: { type: DataTypes.INTEGER, allowNull: false, unique: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: false },
    isIncome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
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
User.hasMany(Transaction);
Transaction.belongsTo(User, { foreignKey: 'UserID', as: 'UserTransactions' });

User.hasMany(typesOfTransactions);
typesOfTransactions.belongsTo(User, { foreignKey: 'UserID', as: 'UserTypesOfTransactions' });

User.hasMany(transLimitations);
transLimitations.belongsTo(User, { foreignKey: 'UserID', as: 'UserTransLimitations' });

typesOfTransactions.hasMany(transLimitations);
transLimitations.belongsTo(typesOfTransactions, { foreignKey: 'typeOfTransID', as: 'TypeTransLimitations' });

module.exports = {
    User,
    Transaction,
    transLimitations,
    typesOfTransactions, 
    createDefaultTransactionTypes
}