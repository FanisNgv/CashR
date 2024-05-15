import React, { useEffect, useState } from 'react';
import './Modal.css'
import axios from "axios";
import MultiSelect from "../DropDown/DropDownMulti";
import MyDatePickerRange from "../DatePicker/DatePickerRange";

const Decimal = require('decimal.js');
const ModalFilterRange = ({ setModalFilterIsOpened, expensesSum, incomesSum, setIncomeSum, total, setTotal, setExpensesSum, modalFilterIsOpened, transactions, filteredTransactions, setFilteredTransactions }) => {

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    let values = filteredTransactions.map(transaction => parseFloat(transaction.valueOfTransaction));
    let expenses = values.filter(transaction => transaction < 0);
    let incomes = values.filter(transaction => transaction > 0);

    setExpensesSum(expenses.reduce((total, amount) => total + amount, 0));
    setIncomeSum(incomes.reduce((total, amount) => total + amount, 0));
    
    setTotal((expensesSum + incomesSum).toFixed(2));

    useEffect(() => {
        if (transactions.length > 0) {
            const sortedTransactions = transactions.sort((a, b) => new Date(a.dateOfTransaction) - new Date(b.dateOfTransaction));
            const firstTransactionDate = new Date(sortedTransactions[0].dateOfTransaction);
            const lastTransactionDate = new Date(sortedTransactions[sortedTransactions.length - 1].dateOfTransaction);
            setStartDate(firstTransactionDate);
            setEndDate(lastTransactionDate);
        }
    }, [transactions]);


    useEffect(() => {
        let values = filteredTransactions.map(transaction => parseFloat(transaction.valueOfTransaction));
        let expenses = values.filter(transaction => transaction < 0);
        let incomes = values.filter(transaction => transaction > 0);

        setExpensesSum(expenses.reduce((total, amount) => total + amount, 0));
        setIncomeSum(incomes.reduce((total, amount) => total + amount, 0));
        setTotal(expensesSum + incomesSum);
    }, [filteredTransactions]);

    function filterByDate(transactions, startDate, endDate) {
        return transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.dateOfTransaction);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }

    function handleFilterClick() {
        setFilteredTransactions(filterByDate(transactions, startDate, endDate));        
    }

    return (
        <div className={modalFilterIsOpened ? "modal active" : "modal"} onClick={function () { setModalFilterIsOpened(false) }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <h1>Введите диапазон дат:</h1>

                <div id="datePickerRange">
                    <MyDatePickerRange startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} className="hidden" />
                </div>


                <div className="addButton">
                    <button onClick={handleFilterClick}>Отфильтровать</button>
                </div>
            </div>
        </div>
    );
};
export default ModalFilterRange;