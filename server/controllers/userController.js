const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { secret } = require("../config");
const express = require("express");
const path = require("path")
const bodyParser = require('body-parser');
const axios = require('axios');

const User = require('../models/user');
const Transaction = require('../models/transaction')
const { typesOfTransactions, createDefaultTransactionTypes } = require('../models/typesOfTransactions');

const { Op } = require('sequelize'); // Импортируем операторы для Sequelize
const { transaction } = require('../db');
const { type } = require('os');

class UserController {

     async deleteLimitation(req, res) {
         try {
             const { typeOfTransID} = req.body;

             let existingLimitation = await typesOfTransactions.findOne({ where: { id: typeOfTransID } });

             if (existingLimitation) {
                 existingLimitation.limitationValue = null;
                 await existingLimitation.save();
             }
             res.status(200).json({ message: 'Ограничение успешно удалено!' });
         } catch (error) {
             console.error(error);
             res.status(500).json({ message: 'Произошла ошибка при удалении ограничения' });
         }
    }

    async createLimitation(req, res) {
        try {
            const { typeOfTransID, limitationValue } = req.body;

            let existingLimitation = await typesOfTransactions.findOne({ where: { id: typeOfTransID } });

            if (existingLimitation) {
                existingLimitation.limitationValue = limitationValue; 
                await existingLimitation.save();
            }
            res.status(200).json({ message: 'Ограничение успешно создано!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при создании ограничения' });
        }
    } 

    async createTransaction(req, res) {
        try {
            const { userID, come, valueOfTransaction, typeOfTransaction, dateOfTransaction } = req.body; // парсим тело http ответа по этим переменным

            // Находим пользователя и обновляем его баланс
            const user = await User.findByPk(userID);
            if (!user) {
                throw new Error('Пользователь не найден');
            }
            // Создаем новую транзакцию
            const newTransaction = await Transaction.create({
                userID,
                valueOfTransaction,
                come,
                typeOfTransaction,
                dateOfTransaction
            });

            let balance = user.balance;

            // Если это был доход, то прибавляем транзакцию
            if (come === 'Income') {
                balance += parseFloat(valueOfTransaction);
            } else if (come === 'Outcome') {
                balance -= parseFloat(valueOfTransaction);
            }
            const createdTransaction = await Transaction.findByPk(newTransaction.id);

            // Обновляем баланс пользователя
            await User.update({ balance }, { where: { id: userID } });

            res.status(200).json({ message: 'Транзакция успешно создана!', transaction: createdTransaction });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при создании транзакции' });
        }
    }

    async updateTransaction(req, res) {
        try {
            const { userID, transactionID, come, valueOfTransaction, typeOfTransaction, dateOfTransaction } = req.body; // парсим тело http ответа по этим переменным

            const user = await User.findByPk(userID);
            if (!user) {
                throw new Error('Пользователь не найден');
            }

            const [numUpdatedRows, updatedTransaction] = await Transaction.update(
                { come, valueOfTransaction, typeOfTransaction, dateOfTransaction },
                { returning: true, where: { id: transactionID } } // Добавляем опцию returning: true для получения обновленной транзакции
            );


            if (numUpdatedRows === 0) {
                throw new Error('Транзакция не найдена или не была обновлена');
            }


            res.status(200).json({ message: 'Транзакция успешно обновлена!', transaction: updatedTransaction });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при создании транзакции' });
        }
    }
    async getAllTransactions(req, res) {
        try {
            const { userID } = req.body;

            const transactions = await Transaction.findAll({
                where: { userID: userID }
            });

            const plainTransactions = transactions.map(transaction => transaction.get({ plain: true }));
            console.log(plainTransactions)
            res.status(200).json(plainTransactions);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении транзакций' });
        }
    }

    async getTransactions(req, res) {
        try {
            const { userID, limit, page } = req.body;

            // Находим все транзакции пользователя
            const transactions = await Transaction.findAll({
                where: { userID: userID }
            });

            transactions.sort((a, b) => {
                // Сравниваем даты, используя метод getTime() для получения числового представления даты
                return new Date(b.dataValues.dateOfTransaction).getTime() - new Date(a.dataValues.dateOfTransaction).getTime();
            });

            // Вычисляем индексы начала и конца для текущей страницы
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            // Используем startIndex и endIndex для определения порции возвращаемых транзакций
            const results = transactions.slice(startIndex, endIndex);

            res.status(200).json(results); // отправляем клиенту транзакции для текущей страницы со статусом 200
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении транзакций' });
        }
    }

    async getTypesOfTransactions(req, res) {
        try {
            const { userID } = req.body;
            const TypesOfTransactions = await typesOfTransactions.findAll({
                where: { userID: userID }
            });

            res.status(200).json(TypesOfTransactions); // отправляем клиенту все транзакции со статусом 200
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении типа транзакций' });
        }
    }

    async deleteTransaction(req, res) {
        try {
            const { userID, transactionID, come, valueOfTransaction, typeOfTransaction, dateOfTransaction } = req.body; // парсим тело http ответа по этим переменным

            // Удаляем транзакцию из базы данных
            const deletedTransaction = await Transaction.destroy({ where: { id: transactionID } });

            if (!deletedTransaction) {
                return res.status(404).json({ message: 'Транзакция не найдена' });
            }

            res.status(200).json({ message: 'Транзакция успешно удалена', deletedTransactionID: transactionID });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при удалении транзакции' });
        }
    }
    async sendDataToAPI() {
        try {
            // Данные для отправки
            const data = {
                user_input: 0.5 // Пример данных
            };

            // URL вашего Flask API
            const url = 'http://127.0.0.1:8080/predict';

            // Отправка POST-запроса на API
            const response = await axios.post(url, data);

            // Вывод ответа от сервера
            console.log(response.data);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
    
     async updateUser(req, res) {
        try {
            const {id, firstname, lastname, email, balance} = req.body;

            const updatedUser = await User.update(
                { firstname, lastname, email, balance},
                { where: { id: id } }
            );
            const user = await User.findByPk(id);

            res.status(200).json({ message: 'Информация о пользователе обновлена', user: user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при обновлении информации о пользователе' });
        }
    } 
    async deleteCategory(req, res) {
        try{
            const {id} = req.body;
            const deleteCategory = await typesOfTransactions.destroy({ where: { id: id } });
            res.status(200).json({ message: 'Категория успешно удалена' });

        } catch(error){
            res.status(500).json({ message: 'Произошла ошибка при удалении категории' });

        }   
    }
    async createCategory(req, res) {
        try {

            console.log(req.body);
            const { categoryName, isIncome, userID } = req.body; // Извлечение данных из запроса

            // Проверка наличия категории с таким же названием
            const existingCategory = await typesOfTransactions.findOne({ where: { name: categoryName, userID: userID } });
            if (existingCategory) {
                return res.status(400).json({ message: 'Категория с таким названием уже существует' });
            }

            // Создание нового объекта категории
            const newCategory = {
                name: categoryName,
                isIncome: isIncome,
                userID: userID
            };

            // Добавление новой категории
            const addedCategory = await typesOfTransactions.create(newCategory);

            res.status(200).json({ message: 'Категория успешно добавлена', category: addedCategory });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при добавлении категории' });
        }
    }



}

module.exports = new UserController();