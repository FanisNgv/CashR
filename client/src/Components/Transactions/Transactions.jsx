import React, {useEffect, useState, useContext} from 'react';
import './Transactions.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Backdrop, CircularProgress} from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ModalAddTrans from "../Modals/ModalAddTrans";
import { UserTransactionContext } from '../../Context'; // Импортируем контекст

const MainPage = () => {
    const [isLoading, setIsLoading] = useState();

    const { user, setUser, transactions, setTransactions } = useContext(UserTransactionContext); // Используем контекст



    const [addTransactionIsOpened, setAddTransactionIsOpened] = useState(false);
    const [typesOfOutcomes, setTypesOfOutcomes] = useState([]);
    const [typesOfIncomes, setTypesOfIncomes] = useState([]);
    const [sortedTransactions, setSortedTransactions] = useState([]);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [fetching, setFetching] = useState(true);


    useEffect(()=>{
        const fetchData = (async () => {
            setIsLoading(true)

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }
            try {
                const { data: response } = await axios.get('http://localhost:5000/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const transactionsResponse = await fetch('http://localhost:5000/user/getTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: response.id, limit: 10, page: currentPage }),
                });

                const transactionsData = await transactionsResponse.json();
                setTransactions(prevTransactions => [...prevTransactions, ...transactionsData]);
                await new Promise(r => setTimeout(r, 3000));

            } catch (error) {
                console.error(error.message);
            }

            setIsLoading(false);
        })
        fetchData()
    }, [currentPage])

    useEffect(() => {
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
        console.log(addTransactionIsOpened);
    }
    function toggleLoadTransactions(){
        setCurrentPage(currentPage+1)

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
                <div><p>Тип транзакции</p></div>
                <div><p>Сумма</p></div>
            </div>
            {isLoading ? (
                <div className="fullWidthSkeleton">
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '90%', margin: 'auto' }}>
                        {transactions.map((index) => (
                            <React.Fragment key={index}>
                                <Skeleton variant="rounded" animation="wave" height={37} />
                            </React.Fragment>
                        ))}
                    </Box>

                </div>
            ) : (
                    <div>
                        {sortedTransactions && sortedTransactions.reduce((acc, transaction, index, array) => {
                            // Format the date
                            const transactionDate = new Date(transaction.dateOfTransaction);
                            const formattedDate = new Intl.DateTimeFormat('ru-Ru', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            }).format(transactionDate);

                            // Check if it's a new day
                            const prevTransaction = array[index - 1];
                            const prevDate = prevTransaction ? new Date(prevTransaction.dateOfTransaction) : null;
                            const isNewDay = !prevTransaction || transactionDate.toDateString() !== prevDate.toDateString();

                            // Add an extra div for day separation and group the transactions by date
                            if (isNewDay) {
                                acc.push(
                                    <div key={`separator_${formattedDate}`} className="daySeparator">
                                        <div><h2>День транзакций: {formattedDate}</h2></div>
                                    </div>
                                );
                            }

                            // Add transaction row with onClick handler
                            acc.push(
                                <div className="transRow" key={transaction.id}>
                                    <div><h2>{transaction.typeOfTransaction}</h2></div>
                                    <div className='comeContainer'>
                                        <div className='comeOutcome'>
                                            <h2>{transaction.come === 'Outcome' && '' + transaction.valueOfTransaction}</h2>
                                        </div>
                                        <div className='comeIncome'>
                                            <h2>{transaction.come === 'Income' && '+' + transaction.valueOfTransaction}</h2>
                                        </div>
                                    </div>
                                </div>
                            );

                            return acc;
                        }, [])}
                    </div>

            )}
            <ModalAddTrans setIsLoading={setIsLoading} typesOfIncomes={typesOfIncomes}
                typesOfOutcomes={typesOfOutcomes} setAddTransactionIsOpened={setAddTransactionIsOpened}
                addTransactionIsOpened={addTransactionIsOpened} currentPage = {currentPage}/>

            <div className="loadTransactions">
                <button onClick={toggleLoadTransactions}>Загрузить еще</button>
            </div> 
            
                        
        </div>
    );
};

export default MainPage;