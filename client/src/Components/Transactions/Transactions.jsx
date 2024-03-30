import React, {useEffect, useState} from 'react';
import './Transactions.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Backdrop, CircularProgress} from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import {Link} from "react-router-dom";
//import Menu from "../Menu/Menu";
//import ModalAddTrans from "../Modal/ModalAddTrans";
//import MyDatePickerRange from "../DatePicker/DatePickerRange";
import {disableBodyScroll, enableBodyScroll} from "body-scroll-lock";
//import ProfileMenu from "../Menu/ProfileMenu";
//import ModalFilter from "../Modal/ModalFilter";

const MainPage = () => {
    const [isLoading, setIsLoading] = useState();
    const [user, setUser] = useState({
        lastname: "",
        firstname: "",
        email: ""
    });


    const [addTransactionIsOpened, setAddTransactionIsOpened] = useState(false);
    const [typesOfOutcomes, setTypesOfOutcomes] = useState([]);
    const [typesOfIncomes, setTypesOfIncomes] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [sortedTransactions, setSortedTransactions] = useState([]);



    useEffect(() => {
        setIsLoading(true);
        const fetchData = (async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            try {
                const {data: response} = await axios.get('http://localhost:5000/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                await setUser({
                    id: response.id,
                    lastname: response.lastname,
                    firstname: response.firstname,
                    email: response.email,
                    balance: response.balance,
                });

                const transactionsResponse = await fetch('http://localhost:5000/user/getTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },                    
                    body: JSON.stringify({userID: response.id}),
                });

                const transactionsData = await transactionsResponse.json(); 
                setTransactions(transactionsData);

                const typesOfTransaction = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify({userID: response.id}),
                });

                const typesOfTransactionsData = await typesOfTransaction.json()

                const outcomes = [];
                const incomes = [];

                // Разделяем данные на массивы typesOfOutcomes и typesOfIncomes
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
            }
            setIsLoading(false);
        });
        fetchData();
    }, []);


    function toggleAddTransaction() {
        setAddTransactionIsOpened(!addTransactionIsOpened);
        setIsLoading(!isLoading);
    }
    function getDateValue(dateString) {
        return new Date(dateString).getTime();
    }
    useEffect(() => {
        const srtdTransactions = [...transactions].sort(function (a, b) {
            return getDateValue(b.dateOfTransaction) - getDateValue(a.dateOfTransaction);
        });
        setSortedTransactions(srtdTransactions);
    }, [transactions])

    const [standartSet, setStandartSet] = useState([]);
    function getDateValue(dateString) {
        return new Date(dateString).getTime();
    }
    useEffect(() => {
        const srtdTransactions = [...transactions].sort(function (a, b) {
            return getDateValue(b.dateOfTransaction) - getDateValue(a.dateOfTransaction);
        });
        setStandartSet(srtdTransactions);
    }, [transactions])

    return (
        <div className="Transactions">
            <header>
                <div className="MainBar">
                    <h1 className="Logo">CashR</h1>
                    <div className="userName">
                        <div className="userIcon">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <h1>{user.lastname} {user.firstname}</h1>
                    </div>
                </div>
            </header>
            <div className="MainContent">
                <div className="firstRow">
                    <button onClick={toggleAddTransaction}>Добавить транзакцию</button>    
                </div>    
            </div>
            <div className="transHeader">
                <div><p>Сумма</p></div>
                <div><p>Тип транзакции</p></div>
                <div><p>Дата транзакции</p></div>
            </div>
            {isLoading ? (
                <div className="fullWidthSkeleton">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Skeleton variant="rounded" animation="wave" height={37} />
                        <Skeleton variant="rounded" height={37} />
                        <Skeleton variant="rounded" animation="wave" height={37} />
                        <Skeleton variant="rounded" height={37} />
                        <Skeleton variant="rounded" animation="wave" height={37} />
                        <Skeleton variant="rounded" height={37} />
                        <Skeleton variant="rounded" animation="wave" height={37} />
                        <Skeleton variant="rounded" height={37} />
                        <Skeleton variant="rounded" animation="wave" height={37} />
                        <Skeleton variant="rounded" height={37} />
                        <Skeleton variant="rounded" animation="wave" height={37} />
                    </Box>

                </div>
            ) : (
                    <div>
                        {sortedTransactions && sortedTransactions.map((transaction) => (
                            <div className="transRow" key={transaction._id}>
                                <div className='comeContainer'>
                                    <div className='comeOutcome'>
                                        <h2>{transaction.come === 'Outcome' && '-' + transaction.valueOfTransaction}</h2></div>
                                    <div className='comeIncome'>
                                        <h2>{transaction.come === 'Income' && '+' + transaction.valueOfTransaction}</h2>
                                    </div>
                                </div>
                                <div><h2>{transaction.typeOfTransaction}</h2></div>
                                <div><h2>{new Intl.DateTimeFormat('ru-Ru', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    second: 'numeric'
                                }).format(new Date(transaction.dateOfTransaction))}</h2></div>
                            </div>
                        ))}
                    </div>
            )}

            
            
            {/* <Backdrop open={isLoading}>
                <CircularProgress />
            </Backdrop> */}
        </div>
    );
};

export default MainPage;