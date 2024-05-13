import React, {useEffect, useState, useContext} from 'react';
import './Transactions.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Backdrop, CircularProgress} from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ModalAddTrans from "../Modals/ModalAddTrans";
import ModalCurrentTrans from "../Modals/ModalCurrentTrans";
import { UserTransactionContext } from '../../Context'; // Импортируем контекст
import ModalFilter from '../Modals/ModalFilter';
import Menu from "../Menu/Menu";


const MainPage = () => {

    const [isLoading, setIsLoading] = useState();
    const { user, setUser, transactions, setTransactions, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext); // Используем контекст
    const [addTransactionIsOpened, setAddTransactionIsOpened] = useState(false);
    
    const [sortedTransactions, setSortedTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAllLoaded, setIsAllLoaded] = useState(false);
    const [currentTransModalIsOpened, setCurrentTransModalIsOpened] = useState(false);
    const [modalFilterIsOpened, setModalFilterIsOpened] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState({});
    const [menuActive, setMenuActive] = useState(false);
    const navigate = useNavigate();


    const MenuItems = [{ value: "Список транзакций", action: handleTransClick, icon: "trans" }, {
        value: "Анализ транзакций",
        action: handleTransAnalyseClick,
        icon: "analyse"
    },{
        value: "Прогнозирование",
        action: handlePredictClick,
        icon: "predict"
    
    }];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found in localStorage');
                return;
            }

            // Очистить список транзакций перед загрузкой новых данных
            setTransactions([]);

            try {
                // Загрузка информации о пользователе
                const { data: response } = await axios.get('http://localhost:5000/auth/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Загрузка транзакций
                const transactionsResponse = await fetch('http://localhost:5000/user/getTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: response.id, limit: 10, page: currentPage }),
                });

                const transactionsData = await transactionsResponse.json();

                if (transactionsData.length < 10) {
                    setIsAllLoaded(true);
                } else {
                    setIsAllLoaded(false);
                }

                // Установить новый список транзакций
                setTransactions(transactionsData);

                await new Promise(r => setTimeout(r, 3000));
            } catch (error) {
                console.error(error.message);
            }

            setIsLoading(false);
        };
        fetchData();
    }, [currentPage]);


    /* useEffect(() => {
        if (transactions.length < 10) {
            setIsAllLoaded(true);
        } else {
            setIsAllLoaded(false);
        }
    }, [transactions]); */
    
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

    function currentTransModal(transaction){
        setCurrentTransModalIsOpened(!currentTransModalIsOpened);
        setCurrentTransaction(transaction);
    }
    function toggleMenu() {
        setMenuActive(!menuActive);
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
    function handleLogoutClick() {
        navigate('/login');
        localStorage.clear();
    }
    function toggleAddTransaction() {
        setAddTransactionIsOpened(!addTransactionIsOpened);
    }
    function toggleFilterTransactions(){
        setModalFilterIsOpened(!modalFilterIsOpened);
    }
    function toggleLoadTransactions() {
        if (!isAllLoaded) {
            setCurrentPage(currentPage + 1);
            console.log(currentPage);
        }
        else{
            alert('Вы уже находитесь на последней странице');
        }
    }
    function toggleLoadPrevTransactions() {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
        else {
            alert('Вы уже находитесь на первой странице');
        }
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

    function getDateValue(dateString) {
        return new Date(dateString).getTime();
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
            <div className="MainContent">
                <div className="firstRow">
                    <button onClick={toggleAddTransaction}>Добавить транзакцию</button>
                    <span onClick={toggleFilterTransactions} className="material-symbols-outlined">filter_list</span>    
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
                    {sortedTransactions && sortedTransactions.map((transaction, index, array) => {
                        const transactionDate = new Date(transaction.dateOfTransaction);
                        const formattedDate = new Intl.DateTimeFormat('ru-Ru', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric'
                        }).format(transactionDate);

                        const prevTransaction = array[index - 1];
                        const prevDate = prevTransaction ? new Date(prevTransaction.dateOfTransaction) : null;
                        const isNewDay = !prevTransaction || transactionDate.toDateString() !== prevDate.toDateString();

                        const elements = [];

                        if (isNewDay) {
                            elements.push(
                                <div key={`separator_${formattedDate}`} className="daySeparator">
                                    <div><h2>День транзакций: {formattedDate}</h2></div>
                                </div>
                            );
                        }

                        elements.push(
                            <div className="transRow" key={transaction.id} onClick={() => currentTransModal(transaction)}>
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

                        return elements;
                    })}
                </div>
            )}
            
            <ModalAddTrans setIsLoading={setIsLoading} typesOfIncomes={typesOfIncomes}
                typesOfOutcomes={typesOfOutcomes} setAddTransactionIsOpened={setAddTransactionIsOpened}
                addTransactionIsOpened={addTransactionIsOpened} currentPage = {currentPage}/>

            <ModalCurrentTrans setIsLoading={setIsLoading} typesOfIncomes={typesOfIncomes}
                typesOfOutcomes={typesOfOutcomes} setCurrentTransModalIsOpened={setCurrentTransModalIsOpened}
                currentTransModalIsOpened={currentTransModalIsOpened} transaction={currentTransaction} />

            <ModalFilter  modalFilterIsOpened={modalFilterIsOpened} setModalFilterIsOpened={setModalFilterIsOpened}
                setSortedTransactions={setSortedTransactions} typesOfOutcomes={typesOfOutcomes} typesOfIncomes={typesOfIncomes} />


            <div className="loadTransactions">
                <button onClick={toggleLoadPrevTransactions}>Назад</button>
                <button onClick={toggleLoadTransactions}>Вперед</button>
            </div>

            <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"}
                items={MenuItems} />

            <br></br>

            <footer></footer>
        </div>
    );
};

export default MainPage;