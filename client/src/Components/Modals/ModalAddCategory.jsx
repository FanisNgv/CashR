import React, { useEffect, useState, useContext } from 'react';
import './Modal.css'
import axios from "axios";
import SingleSelect from "../DropDown/DropDownSingle";
import MyDatePicker from "../DatePicker/DatePicker";
import { UserTransactionContext } from '../../Context';


const ModalAddCategory = ({ setAddCategoryActive, setIsLoading, addCategoryActive, isCategoryIncome, setIsCategoryIncome, isCategoryOutcome, setIsCategoryOutcome }) => {


    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [categoryName, setCategoryName] = useState("");
    

    async function handleAddCategory(isCategoryIncome, isCategoryOutcome) {
        setIsLoading(true);


        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        const newCategory = {
            name: categoryName,
            isIncome: isCategoryIncome ? true : false,
            userID: user.id
        }

        try {
            const addCategoryResponse = await fetch('http://localhost:5000/user/createCategory', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ categoryName: newCategory.name, isIncome: newCategory.isIncome, userID: newCategory.userID }),
            });

            if (addCategoryResponse.ok) {
                const data = await addCategoryResponse.json();
                alert(data.message);
            } else {
                const errorData = await addCategoryResponse.json();
                alert(errorData.message);
            }

            const typesOfTransaction = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID: user.id }),
            });

            const typesOfTransactionsData = await typesOfTransaction.json()

            const outcomes = [];
            const incomes = [];

            typesOfTransactionsData.forEach(transaction => {
                if (transaction.isIncome) {
                    incomes.push(transaction);
                } else {
                    outcomes.push(transaction);
                }
            });


            await setTypesOfOutcomes(outcomes);
            await setTypesOfIncomes(incomes);

        } catch (error) {
            console.error(error.message);
            setIsLoading(false);
            alert('Произошла ошибка при добавлении категории');
        }


        setIsLoading(false);
    }

    return (
        <div className={addCategoryActive ? "modal active" : "modal"} onClick={() => { setAddCategoryActive(false); setIsCategoryIncome(false); setIsCategoryOutcome(false); }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                {isCategoryIncome ? (
                    <h1>Добавить категорию дохода:</h1>
                ) : isCategoryOutcome ? (
                    <h1>Добавить категорию расхода:</h1>
                ) : null}
                <div className="modalAddCategoryInput">
                    <input type="text" placeholder={"Введите название категории"} onChange={(e) => setCategoryName(e.target.value)} required />
                </div>
                <div className="modalAddCategoryButton">
                    <button onClick={() => handleAddCategory(isCategoryIncome, isCategoryOutcome)}>Добавить категорию</button>
                </div>
            </div>
        </div>

    );
};
export default ModalAddCategory;