// index.js - наш главный файл для запуска сервера
require('dotenv').config();
const express = require('express'); // Импортируем модуль express as express. Это удобный веб-фреймворк, при помощи которого удобно делать HTTP запросы
const sequelize = require('./db'); // Выполняется код из db.js, а затем получается результат с него, а именно экспорт
const PORT = process.env.PORT || 5000; // Выбор порта
//const axios = require('axios');

const cors = require("cors")

const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');

const User = require('./models/user') // Хоть эти модели нигде и не используются, я так понял, что тут происходит инициализация моделей и соответственно их дальнейшее создание в бд
const Transaction = require('./models/transaction')
const typesOfTransactions = require('./models/typesOfTransactions')

const app = express(); // Создание экземпляра express

app.use(cors()) // Даем возможность приложению использовать CORS
app.use(express.json()) // Даем возможность приложению парсить JSON



app.use("/auth", authRouter);
app.use("/user", userRouter); // Для пользователя не целесообразно использовать id, т.к. есть токены

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

 