const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const {secret} = require("../config");
const express = require("express");
const path = require("path")
const bodyParser = require('body-parser');

const User = require('../models/user');
const Transaction = require('../models/transaction')

const { Op } = require('sequelize'); // Импортируем операторы для Sequelize

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
            const transactions = await Transaction.findAll({ where: { userID } });

            res.status(200).json(transactions); // отправляем клиенту все транзакции со статусом 200
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении транзакций' });
        }
    }

    async deleteTransaction(req, res){

    }
}

module.exports = new UserController();