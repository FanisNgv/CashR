import React, { useEffect, useState, useContext } from 'react';
import './Modal.css'
import axios from "axios";
import MultiSelect from "../DropDown/DropDownMulti";
import MyDatePickerRange from "../DatePicker/DatePickerRange";
import { UserTransactionContext } from '../../Context';


const ModalFilter = ({ setModalFilterIsOpened, modalFilterIsOpened, setSortedTransactions, typesOfOutcomes,typesOfIncomes}) => {

    const { user, setUser, transactions, setTransactions } = useContext(UserTransactionContext);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [startDate, setStartDate] = useState(new Date("2023-01-01"));
    const [endDate, setEndDate] = useState(new Date("2040-01-01"));
    const [multiSelectIsOpened, setMultiSelectIsOpened] = useState(false);
    const [typesOfComes, setTypesOfComes] = useState([]);

    const [leftBorder, setLeftBorder] = useState();
    const [rightBorder, setRightBorder] = useState();

    useEffect(() => {
        setTypesOfComes(typesOfIncomes.concat(typesOfOutcomes))

       }, [typesOfIncomes, typesOfOutcomes])
    useEffect(() => {console.log(typesOfComes)}, typesOfComes)

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

    /*const srtdTransactions = [...transactions].sort(function(a, b) {
        return getDateValue(b.dateOfTransaction) - getDateValue(a.dateOfTransaction);
    });
    setSortedTransactions(srtdTransactions);

    function getDateValue(dateString) {
        return new Date(dateString).getTime();
    }*/
    function filterByDate(transactions, startDate, endDate) {
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.dateOfTransaction).getTime();
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
        const filteredByDate = await filterByDate(transactions, startDate, endDate);
        let sortedTransactions = filteredByDate;

        if (selectedTypes.length !== 0) {
            sortedTransactions = await filterByTypeOfValue(sortedTransactions, selectedTypes);
        }

        if ((leftBorder === "" || leftBorder === undefined) && (rightBorder === "" || rightBorder === undefined)) {
            // do nothing
        } else if ((leftBorder === "" || leftBorder === undefined) && !(rightBorder === "" || rightBorder === undefined)) {
            setLeftBorder(-Infinity);
        }
        else if ((rightBorder === "" || rightBorder === undefined) && !(leftBorder === "" || leftBorder === undefined)){
            setRightBorder(Infinity);
        } 
        else if (leftBorder > rightBorder) {
            alert("Левая граница не может быть больше правой!");
        } else {
            sortedTransactions = await filterByValue(sortedTransactions, leftBorder, rightBorder);
        }

        setSortedTransactions(sortedTransactions);
    }


     



    /*useEffect(()=>{
        if(selectedTypes.length===0){
            setSortedTransactions(standartSet);
        }
        else{
            setSortedTransactions(filterByTypeOfValue(sortedTransactions, selectedTypes));
        }
    },[selectedTypes])*/

    /*useEffect(()=>{
        setSortedTransactions(filterByDate(sortedTransactions, startDate, endDate));
    },[startDate, endDate])*/

    /*useEffect(() => {
        if (leftBorder === "" && rightBorder === "") {
            setSortedTransactions(standartSet);
        } else {
            setSortedTransactions(filterByValue(sortedTransactions, leftBorder, rightBorder));
        }
    }, [leftBorder, rightBorder]);*/



    return (
        <div className={modalFilterIsOpened ? "modal active" : "modal"} onClick={function () { setModalFilterIsOpened(false) }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <h1>Введите диапазон дат:</h1>

                <div id="datePickerRange">
                    <MyDatePickerRange startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} className="hidden" />
                </div>

                <h1>Введите тип транзакции:</h1>
                <MultiSelect typesOfComes = {typesOfComes} selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes} onClick={function () { setMultiSelectIsOpened(!multiSelectIsOpened) }} />

                <h1>Введите диапазон значений транзакции:</h1>
                <div className="rangeOfSum">
                    <input type="number" value={leftBorder} placeholder={"Введите левую границу"} onChange={(e) => { setLeftBorder(e.target.value) }} required />
                    <input type="number" value={rightBorder} placeholder={"Введите правую границу"} onChange={(e) => { setRightBorder(e.target.value) }} required />
                </div>

                <div className="addButton">
                    <button onClick={handleFilterClick}>Отфильтровать</button>
                </div>
            </div>
        </div>
    );
};
export default ModalFilter;