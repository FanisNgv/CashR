// index.js - наш главный файл для запуска сервера
require('dotenv').config();
const express = require('express'); // Импортируем модуль express as express. Это удобный веб-фреймворк, при помощи которого удобно делать HTTP запросы
const sequelize = require('./db'); // Выполняется код из db.js, а затем получается результат с него, а именно экспорт
const PORT = process.env.PORT || 5000; // Выбор порта
const cors = require("cors")

const User = require('./models/user')
const Transaction = require('./models/transaction')

const app = express(); // Создание экземпляра express

app.use(cors()) // Даем возможность приложению использовать CORS
app.use(express.json()) // Даем возможность приложению парсить JSON

/*
app.get('/', (req, res) =>{
    res.status(200).json({message: 'Работает, епти!'})
})
*/

// Все функции для работы с БД асинхронные
const start = async ()=>{
    try{
        await sequelize.authenticate() // подключение к бд
        await sequelize.sync() // Сверка состояния БД со схемой
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e){
        console.log(e)
    }
}
start()

