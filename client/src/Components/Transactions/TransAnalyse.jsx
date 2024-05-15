import React, { useEffect, useState, useContext } from 'react';
import './Transactions.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';

import { Link } from "react-router-dom";
import Menu from "../Menu/Menu";
import MyDatePickerRange from "../DatePicker/DatePickerRange";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import ProfileMenu from "../Menu/ProfileMenu";
import ModalFilterRange from "../Modals/ModalFilterRange"

import IncomePieChart from "../PieCharts/IncomePieCharts";
import OutcomePieChart from "../PieCharts/OutcomePieCharts";
import IncomePieBar from "../PieCharts/IncomePieBars";
import OutcomePieBar from "../PieCharts/OutcomePieBars";

import { UserTransactionContext } from '../../Context'; // Импортируем контекст


const TransAnalyse = () => {
    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [isLoading, setIsLoading] = useState();
    const [menuActive, setMenuActive] = useState(false);
    const [profileActive, setProfileActive] = useState(false);
    const [modalFilterIsOpened, setModalFilterIsOpened] = useState(false);
    const[allTransactions, setAllTransactions] = useState([]);
    const [expensesSum, setExpensesSum] = useState();
    const [incomesSum, setIncomeSum] = useState();
    const [total, setTotal] = useState();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [sortedTransactions, setSortedTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

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

    


    function handlePredictClick(){
        navigate('/predict');
    }

    function handleTransLimitationsClick() {
        navigate('/limitations');
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
                const { data: response } = await axios.get('http://localhost:5000/auth/user', {
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
            
                

                const transactionsResponse = await fetch('http://localhost:5000/user/getAllTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: response.id}),
                });

                const transactionsData = await transactionsResponse.json();
                setAllTransactions(transactionsData);
                setFilteredTransactions(transactionsData);


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
    function toggleProfile() {
        setProfileActive(!profileActive);
    }
    function toggleModalFilter() {
        setModalFilterIsOpened(!modalFilterIsOpened);
    }

    const [standartSet, setStandartSet] = useState([]);

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


            <div className="mainContent">
                <div className="filterRow">
                    <h2>Баланс:</h2>
                    <h2>Общий оборот за период:</h2>
                    <h2>Общий расход за период:</h2>
                    <h2>Общий доход за период:</h2>
                    <span onClick={toggleModalFilter} className="material-symbols-outlined">filter_list</span>
                </div>
                <div className="resultRow">
                    <h2>{user.balance}р.</h2>
                    <h2>{total}</h2>
                    <h2>{expensesSum}</h2>
                    <h2>{incomesSum}</h2>
                </div>

            </div>
            <div className="PieCharts">
                <IncomePieChart filteredTransactions={filteredTransactions} />
                <OutcomePieChart filteredTransactions={filteredTransactions} />
            </div>

            <div className="PieBars">
                <IncomePieBar filteredTransactions={filteredTransactions} />
                <OutcomePieBar filteredTransactions={filteredTransactions} />
            </div>

            <ModalFilterRange expensesSum={expensesSum} setExpensesSum={setExpensesSum} filteredTransactions={filteredTransactions} setFilteredTransactions={setFilteredTransactions} incomesSum={incomesSum} setIncomeSum={setIncomeSum} total={total} setTotal={setTotal} modalFilterIsOpened={modalFilterIsOpened} setModalFilterIsOpened={setModalFilterIsOpened} transactions={allTransactions}/>

            <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"}
                items={MenuItems} />
            <Backdrop open={isLoading}>
                <CircularProgress />
            </Backdrop>

            <div id="addGap"></div>
        </div>
    );
}
export default TransAnalyse;