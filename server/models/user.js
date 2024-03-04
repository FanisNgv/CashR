const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db'); // Предполагается, что ваш экземпляр Sequelize называется "sequelize"

class User extends Model {}

User.init({
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    balance: { type: DataTypes.FLOAT, allowNull: false }
}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;