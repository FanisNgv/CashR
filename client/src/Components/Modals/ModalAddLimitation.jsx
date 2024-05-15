import React, { useEffect, useState, useContext } from 'react';
import './Modal.css'
import axios from "axios";
import SingleSelect from "../DropDown/DropDownSingle";
import MyDatePicker from "../DatePicker/DatePicker";
import { UserTransactionContext } from '../../Context';


const ModalAddLimitation = ({addLimitationModalActive, setAddLimitationModalActive, currentCategory }) => {


    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [limitationValue, setLimitationValue] = useState('');

    useEffect(() => {
        if (addLimitationModalActive && currentCategory && currentCategory.limitationValue !== undefined) {
            setLimitationValue(currentCategory.limitationValue);
        } else {
            setLimitationValue('');
        }
    }, [addLimitationModalActive, currentCategory]);

    async function handleDelLimitation(currentCategory) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

         const delResponse = await fetch('http://localhost:5000/user/deleteLimitation', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
             body: JSON.stringify({ typeOfTransID: currentCategory.id}),
        });

        const transLimitations = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: user.id }),
        });
        const typesOfTransactionsData = await transLimitations.json();

        const outcomes = [];

        typesOfTransactionsData.forEach(transaction => {
            if (!transaction.isIncome) {
                outcomes.push(transaction);
            }
        });

        const sortedTypesOfOutcomes = [...outcomes].sort((a, b) => a.name.localeCompare(b.name));

        await setTypesOfOutcomes(sortedTypesOfOutcomes);
        setAddLimitationModalActive(false);
        setLimitationValue('');

    }


    async function handleAddLimitation(currentCategory) {

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        if (!limitationValue) {
            alert('Введите значение ограничения');
            return;
        }

        const limitationResponse = await fetch('http://localhost:5000/user/createLimitation', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ typeOfTransID: currentCategory.id, limitationValue: limitationValue}),
        });
        
        const transLimitations = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID: user.id }),
        });
        const typesOfTransactionsData = await transLimitations.json();

        const outcomes = [];

        typesOfTransactionsData.forEach(transaction => {
            if (!transaction.isIncome) {
                outcomes.push(transaction);
            }
        });

        const sortedTypesOfOutcomes = [...outcomes].sort((a, b) => a.name.localeCompare(b.name));

        await setTypesOfOutcomes(sortedTypesOfOutcomes);
        setAddLimitationModalActive(false);
        setLimitationValue('');

        
    }

    return (
        <div className={addLimitationModalActive ? "modal active" : "modal"} onClick={() => { setAddLimitationModalActive(false) }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <h1>Добавьте потолок расхода категории "{currentCategory && currentCategory.name}"</h1>
                <div className="modalAddCategoryInput">
                    <input style={{ marginLeft: '150px', width: '300px', height: '40px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '10px' }} type="number" placeholder={"Введите значение ограничения"} value={limitationValue} onChange={(e) => setLimitationValue(e.target.value)} required />

                </div>
                <div style={{display: 'flex', marginTop: '250px', marginLeft: '120px'}}>
                    <div>
                        <button style={{width: '150px'}} onClick={() => handleAddLimitation(currentCategory)}>Добавить ограничение</button>
                    </div>
                    <div>
                        <button style={{width: '150px', marginLeft: '50px'}} onClick={() => handleDelLimitation(currentCategory)}>Удалить ограничение</button>
                    </div>
                </div>
                
            </div>
        </div>

    );
};
export default ModalAddLimitation;
