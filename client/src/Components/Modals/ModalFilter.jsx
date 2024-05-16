import React, { useEffect, useState, useContext } from 'react';
import './Modal.css'
import axios from "axios";
import MultiSelect from "../DropDown/DropDownMulti";
import MyDatePickerRange from "../DatePicker/DatePickerRange";
import { UserTransactionContext } from '../../Context';


const ModalFilter = ({ setModalFilterIsOpened, modalFilterIsOpened, setSortedTransactions, typesOfOutcomes,typesOfIncomes}) => {

    const { user, setUser, transactions, setTransactions } = useContext(UserTransactionContext);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [multiSelectIsOpened, setMultiSelectIsOpened] = useState(false);
    const [typesOfComes, setTypesOfComes] = useState([]);
    const [staticSortedTransactions, setStaticSortedTransactions] = useState([]);
    const [leftBorder, setLeftBorder] = useState();
    const [rightBorder, setRightBorder] = useState();

    useEffect(() => {
        const fetchData = (async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            const transactionsResponse = await fetch('http://localhost:5000/user/getAllTransactions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID: user.id }),
            });

            const transactionsData = await transactionsResponse.json();

            // Проверяем, является ли transactionsData массивом
            if (Array.isArray(transactionsData) && transactionsData.length > 0) {
                transactionsData.sort((a, b) => {
                    const dateA = new Date(a.dateOfTransaction);
                    const dateB = new Date(b.dateOfTransaction);
                    return dateB - dateA;
                });

                // Извлекаем даты первой и последней транзакции
                const lastTransaction = transactionsData[0];
                const firstTransaction = transactionsData[transactionsData.length - 1];
                const startDateTemp = new Date(firstTransaction.dateOfTransaction);
                const endDateTemp = new Date(lastTransaction.dateOfTransaction);

                setStartDate(startDateTemp);
                setEndDate(endDateTemp);

                setStaticSortedTransactions(transactionsData);
            } else {
                console.error('transactionsData is not an array:', transactionsData);
            }


        });
        fetchData();
    }, [modalFilterIsOpened]);


    useEffect(() => {
        setTypesOfComes(typesOfIncomes.concat(typesOfOutcomes))

       }, [typesOfIncomes, typesOfOutcomes])

    useEffect(() => {console.log(typesOfComes)}, [typesOfComes])

    function filterByValue(transactions, leftBorder, rightBorder) {
        return transactions.filter((transaction) => {
            return parseFloat(transaction.valueOfTransaction) >= leftBorder && parseFloat(transaction.valueOfTransaction) <= rightBorder;
        });
    }
    function filterByTypeOfValue(transactions, selectedTypes) {
        const selectedValues = selectedTypes.map((selectedType) => selectedType.value);
        return transactions.filter((transaction) => {
            return selectedValues.includes(transaction.typeOfTransaction);
        });
    }

    function filterByDate(transactions, startDate, endDate) {
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.dateOfTransaction);
            return transactionDate >= startDate && transactionDate <= endDate;
        });

        const sortedTransactions = filteredTransactions.sort((a, b) => {
            const dateA = new Date(a.dateOfTransaction);
            const dateB = new Date(b.dateOfTransaction);
            return dateB - dateA;
        });

        return sortedTransactions;
    }



    async function handleFilterClick() {
                
        let filteredByDate = filterByDate(staticSortedTransactions, startDate, endDate);
        console.log("hehehe", filteredByDate)

        
        if (selectedTypes.length !== 0) {
            filteredByDate = filterByTypeOfValue(filteredByDate, selectedTypes);
        }
        console.log("filteredByDate", filteredByDate)
        // Применяем фильтрацию по диапазону значений транзакции
        if ((leftBorder === "" || leftBorder === undefined) && (rightBorder === "" || rightBorder === undefined)) {
            filteredByDate = await filterByValue(filteredByDate, -Infinity, Infinity);

        } else if ((leftBorder === "" || leftBorder === undefined) && !(rightBorder === "" || rightBorder === undefined)) {
            filteredByDate = await filterByValue(filteredByDate, -Infinity, rightBorder);
        }
        else if ((rightBorder === "" || rightBorder === undefined) && !(leftBorder === "" || leftBorder === undefined)) {
            filteredByDate = await filterByValue(filteredByDate, leftBorder, Infinity);
        }
        else if (parseFloat(leftBorder) > parseFloat(rightBorder)) {
            alert("Левая граница не может быть больше правой!");
        } else {
            filteredByDate = await filterByValue(filteredByDate, leftBorder, rightBorder);
        }

        console.log(filteredByDate)
        setSortedTransactions(filteredByDate);

    }

    function handleResetClick() {
        if(staticSortedTransactions.length > 0) {
        setSelectedTypes([]);
        const lastTransaction = staticSortedTransactions[0];
        const firstTransaction = staticSortedTransactions[staticSortedTransactions.length - 1];

        // Извлекаем даты первой и последней транзакции
        const startDate = new Date(firstTransaction.dateOfTransaction);
        const endDate = new Date(lastTransaction.dateOfTransaction);

        setStartDate(startDate);
        setEndDate(endDate);
        }

        setMultiSelectIsOpened(false);
        setLeftBorder("")
        setRightBorder("")
        setSortedTransactions(staticSortedTransactions)
    }

    return (
        <div className={modalFilterIsOpened ? "modal active" : "modal"} onClick={function () { setModalFilterIsOpened(false) }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <h1>Введите диапазон дат:</h1>

                <div className="dateOfTrans">
                    <MyDatePickerRange startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} className="hidden" />
                </div>

                <h1>Введите тип транзакции:</h1>
                <MultiSelect typesOfComes = {typesOfComes} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} onClick={function () { setMultiSelectIsOpened(!multiSelectIsOpened) }} />

                <h1>Введите диапазон суммы:</h1>
                <div className="rangeOfSum">
                    <input type="number" style={{ border: '1px solid #ccc', borderRadius: '10px' }} value={leftBorder} placeholder={"Введите левую границу"} onChange={(e) => { setLeftBorder(e.target.value) }} required />
                    <input type="number" style={{ border: '1px solid #ccc', borderRadius: '10px' }} value={rightBorder} placeholder={"Введите правую границу"} onChange={(e) => { setRightBorder(e.target.value) }} required />
                </div>

                <div className="buttonFilterRow">
                    <button onClick={handleFilterClick}>Отфильтровать</button>
                    <button onClick={handleResetClick}>Сброс</button>
                </div>
            </div>
        </div>
    );
};
export default ModalFilter;