// index.js - наш главный файл для запуска сервера
require('dotenv').config()
const express = require('express'); // Импортируем модуль express as express. Это удобный веб-фреймворк, при помощи которого удобно делать HTTP запросы
const PORT = process.env.PORT || 5000; // Выбор порта

const app = express(); // Создание экземпляра express

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))