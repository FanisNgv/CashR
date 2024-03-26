const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require("../config");
const express = require("express");
const path = require("path")
const bodyParser = require('body-parser');

const User = require('../models/user');
const Transaction = require('../models/transaction')
const TypesOfTransactions = require('../models/typesOfTransactions')

const { Op} = require('sequelize'); // Импортируем операторы для Sequelize

class UserController {

    async createTransaction(req, res) {
        try {
            const { userID, come, valueOfTransaction, typeOfTransaction, dateOfTransaction } = req.body; // парсим тело http ответа по этим переменным

            // Создаем новую транзакцию
            const newTransaction = await Transaction.create({
                userID,
                valueOfTransaction,
                come,
                typeOfTransaction,
                dateOfTransaction
            });

            // Находим пользователя и обновляем его баланс
            const user = await User.findByPk(userID);
            if (!user) {
                throw new Error('Пользователь не найден');
            }

            let balance = user.balance;

            // Если это был доход, то прибавляем транзакцию
            if (come === 'Income') {
                balance += parseFloat(valueOfTransaction);
            } else if (come === 'Outcome') {
                balance -= parseFloat(valueOfTransaction);
            }

            // Обновляем баланс пользователя
            await User.update({ balance }, { where: { id: userID } });

            res.status(200).json({ message: 'Транзакция успешно создана!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при создании транзакции' });
        }
    }

    async getTransactions(req, res) {
        try {
            const { userID } = req.body;

            // Находим все транзакции пользователя
            const transactions = await Transaction.findAll({
                where: { userID: userID }
            });

            res.status(200).json(transactions); // отправляем клиенту все транзакции со статусом 200
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении транзакций' });
        }
    }
    async getTypesOfTransactions(req, res) {
        try {
            const { userID } = req.body;
            const typesOfTransactions = await TypesOfTransactions.findAll({
                where: { userID: userID }
            });

<<<<<<< HEAD
            res.status(200).json(typesOfTransactions); // отправляем клиенту все транзакции со статусом 200
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении типа транзакций'});
=======
    async deleteTransaction(req, res) {
        try {
            const transactionID = req.params.transactionID; // Получаем ID транзакции из URL параметра, т.е. значение ID получается из параметра маршрута

            // Удаляем транзакцию из базы данных
            const deletedTransaction = await Transaction.destroy({ where: { id: transactionID } });

            if (!deletedTransaction) {
                return res.status(404).json({ message: 'Транзакция не найдена' });
            }

            res.status(200).json({ message: 'Транзакция успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при удалении транзакции' });
>>>>>>> c55257bca6f830e073b8803cc16b72c6d6f155a2
        }
    }

    async deleteTransaction(req, res) {
        try {
            const transactionID = req.params.transactionID; // Получаем ID транзакции из URL параметра, т.е. значение ID получается из параметра маршрута

            // Удаляем транзакцию из базы данных
            const deletedTransaction = await Transaction.destroy({ where: { id: transactionID } });

            if (!deletedTransaction) {
                return res.status(404).json({ message: 'Транзакция не найдена' });
            }

            res.status(200).json({ message: 'Транзакция успешно удалена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при удалении транзакции' });
        }
    }

    async updateTransaction(req, res) {
        try {
            const transactionID = req.params.transactionID; // Получаем ID транзакции из URL параметра

            // Извлекаем данные для обновления из тела запроса
            const { userID, come, valueOfTransaction, typeOfTransaction, dateOfTransaction } = req.body;

            // Обновляем транзакцию в базе данных
            const updatedTransaction = await Transaction.update(
                { userID, come, valueOfTransaction, typeOfTransaction, dateOfTransaction },
                { where: { id: transactionID } }
            );

            if (!updatedTransaction[0]) {
                return res.status(404).json({ message: 'Транзакция не найдена' });
            }

            res.status(200).json({ message: 'Транзакция успешно обновлена' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при обновлении транзакции' });
        }
    }


}

module.exports = new UserController();