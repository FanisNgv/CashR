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
const { transaction } = require('../db');

class UserController {

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
    async getAllTransactions(req, res){
        try {
            const { userID} = req.body;

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
            const typesOfTransactions = await TypesOfTransactions.findAll({
                where: { userID: userID }
            });

            res.status(200).json(typesOfTransactions); // отправляем клиенту все транзакции со статусом 200
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Произошла ошибка при получении типа транзакций'});
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

    /* async updateTransaction(req, res) {
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
    } */


}

module.exports = new UserController();