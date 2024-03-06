const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');

class typesOfTransactions extends Model {}

typesOfTransactions.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isIncome: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isDefault:{type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false},
    isDeleted:{type: DataTypes.BOOLEAN, allowNull:false, defaultValue: false,
        // это поле необходимо, чтобы ослеживать стандартные удаленные поля пользователя, чтобы они затем не появлялись
        validate: {
            isDeletedTrueOnlyIfIsDefaultTrue(value) {
                if (value === true && this.isDefault !== true) {
                    throw new Error('isDeleted must be true only if isDefault is true');
                }
            }
        }}
}, {
    sequelize,
    modelName: 'typesOfTransactions'
});

const defaultTransactionTypes = [
    { name: 'Еда', isIncome: false, isDefault: true },
    { name: 'Жилье', isIncome: false, isDefault: true },
    { name: 'Здоровье', isIncome: false, isDefault: true },
    { name: 'Спорт', isIncome: false, isDefault: true },
    { name: 'Транспорт', isIncome: false, isDefault: true },
    { name: 'Зарплата', isIncome: true, isDefault: true },
    { name: 'Стипендия', isIncome: true, isDefault: true },
    { name: 'Перевод', isIncome: true, isDefault: true }
];

(async () => {
    try {
        await sequelize.sync();
        for (const type of defaultTransactionTypes) {
            await typesOfTransactions.findOrCreate({ where: { name: type.name }, defaults: { isIncome: type.isIncome, isDefault: type.isDefault } });
        }
        console.log('Data has been synchronized');
    } catch (error) {
        console.error('Error syncing data:', error);
    }
})();

module.exports = typesOfTransactions;
