import React, { useEffect, useState, useContext } from 'react';
import './Transactions.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';

import { UserTransactionContext } from '../../Context'; // Импортируем контекст
import ModalAddLimitation from '../Modals/ModalAddLimitation';
import Menu from "../Menu/Menu";


const TransLimitations = () => {
    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [isLoading, setIsLoading] = useState();
    const [menuActive, setMenuActive] = useState(false);
    const [addLimitationModalActive, setAddLimitationModalActive] = useState(false);
    const [currentCategory, setCurrentCategory] = useState();

    const navigate = useNavigate();


    const MenuItems = [{ value: "Список транзакций", action: handleTransClick, icon: "trans" }, {
        value: "Анализ транзакций",
        action: handleTransAnalyseClick,
        icon: "analyse"
    }, {
        value: "Прогнозирование",
        action: handlePredictClick,
        icon: "predict"

    },
    {
        value: "Ограничения",
        action: handleTransLimitationsClick,
        icon: "limitations"
    }];

    function handleTransLimitationsClick(){
        navigate('/limitations');
    }

    function handlePredictClick() {
        navigate('/predict');
    }
    function handleTransAnalyseClick() {
        navigate('/transAnalyse');
    }
    function handleTransClick() {
        navigate('/transactions');
    }
    function handleProfileClick() {
        navigate('/profile');
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = (async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            try {
                const userResponse = await fetch('http://localhost:5000/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!userResponse.ok) {
                    throw new Error('Ошибка при получении данных пользователя');
                }
                const userData = await userResponse.json();

                await setUser({
                    id: userData.id,
                    lastname: userData.lastname,
                    firstname: userData.firstname,
                    email: userData.email,
                    balance: userData.balance,
                });

                const typesOfTransaction = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: userData.id }),
                });

                const typesOfTransactionsData = await typesOfTransaction.json()

                const outcomes = [];

                typesOfTransactionsData.forEach(transaction => {
                    if (!transaction.isIncome) {
                        outcomes.push(transaction);
                    } 
                });

                const sortedTypesOfOutcomes = [...outcomes].sort((a, b) => a.name.localeCompare(b.name));

                await setTypesOfOutcomes(sortedTypesOfOutcomes);

            } catch (error) {
                console.error(error.message);
            }

            setIsLoading(false);
        });
        fetchData();
    }, []);

    function toggleMenu() {
        setMenuActive(!menuActive);
    }

    function toggleAddLimitation(outcomeCategory) {
        setCurrentCategory(outcomeCategory);
        setAddLimitationModalActive(!addLimitationModalActive);
    }



    return (
        <div className="Transactions">
            <header>
                <div className="MainBar">
                    <h1 className="Logo" onClick={toggleMenu}>CashR</h1>
                    <div className="userName">
                        <div className="userIcon">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <h1 onClick={handleProfileClick}>{user.lastname} {user.firstname}</h1>
                    </div>
                </div>
            </header>

            
            <div className="categoryColumn">
                <div style={{ marginTop: '25px' }}></div>
                <h1 style={{ fontSize: '32px', marginLeft: '60px' }}>Выберите расход, на который хотите наложить месячное ограничение</h1>
                <div style={{marginTop: '50px'}}></div>
                {typesOfOutcomes.map((outcomeCategory, index) => {
                    return (
                        <div className="limitationElements"
                            key={index}
                            onClick={() => toggleAddLimitation(outcomeCategory)}
                        >
                            <p style={{ marginBottom: 0 }}>{outcomeCategory.name} -</p>
                            {outcomeCategory.limitationValue ?
                                <p style={{ marginLeft: '5px', marginBottom: 0 }}>Ограничение: {outcomeCategory.limitationValue}</p> :
                                <p style={{ marginLeft: '5px', marginBottom: 0 }}>Нет ограничений</p>
                            }
                        </div>
                    );

                })}
            </div>


            <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"}
                items={MenuItems} />
            <ModalAddLimitation currentCategory={currentCategory} addLimitationModalActive={addLimitationModalActive} setAddLimitationModalActive={setAddLimitationModalActive}/>
        </div>


    );
}
export default TransLimitations;
