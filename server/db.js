const {Sequelize} = require('sequelize') // ORM для того чтобы не писать прямые SQL запросы

// Экспорт экземпляра объекта класса Sequelize с указанием всех данных для конструктора
module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect:'postgres',
        host:process.env.DB_HOST,
        port:process.env.DB_PORT,
        schema:process.env.DB_SCHEME
    }
)