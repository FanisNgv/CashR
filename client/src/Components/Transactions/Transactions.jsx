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
    }

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
            {isLoading ? (
                <div className="fullWidthSkeleton">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                        <Skeleton variant="rounded" animation="wave" height={60} />
                        <Skeleton variant="rounded" height={60} />
                        <Skeleton variant="rounded" animation="wave" height={60} />
                        <Skeleton variant="rounded" height={60} />
                        <Skeleton variant="rounded" animation="wave" height={60} />
                        <Skeleton variant="rounded" height={60} />
                        <Skeleton variant="rounded" animation="wave" height={60} />
                        <Skeleton variant="rounded" height={60} />
                    </Box>

                </div>
            ) : (
                null // отобразим транзакции
            )}

            {/* <Backdrop open={isLoading}>
                <CircularProgress />
            </Backdrop> */}
        </div>
    );
};

export default MainPage;