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


const Predict = () => {
    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [isLoading, setIsLoading] = useState();
    const [menuActive, setMenuActive] = useState(false);
    const [profileActive, setProfileActive] = useState(false);
    const [modalFilterIsOpened, setModalFilterIsOpened] = useState(false);
    const [allTransactions, setAllTransactions] = useState([]);
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

    }];

    const ProfileItems = [{ value: "Выйти", action: handleLogoutClick, icon: "logout" }]

    function handlePredictClick() {
        navigate('/predict');
    }
    function handleTransAnalyseClick() {
        navigate('/transAnalyse');
    }
    function handleTransClick() {
        navigate('/transactions');
    }
    function handleLogoutClick() {
        navigate('/login');
        localStorage.clear();
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
                    body: JSON.stringify({ userID: response.id }),
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
    async function togglePredictTransactions() {
        try {
            const ML_Response = await fetch('http://127.0.0.1:8080/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Добавление заголовка Content-Type
                },
                body: JSON.stringify({ transactions: allTransactions }),
            });

        } catch (error) {
            console.error(error.message);
        }
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
                        <h1>{user.lastname} {user.firstname}</h1>
                    </div>
                </div>
            </header>

            <div className="firstRow">
                <button onClick={togglePredictTransactions}>Спрогнозировать расходы</button>
            </div>

            <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"}
                items={MenuItems} />
            <ProfileMenu items={ProfileItems} userBalance={user.balance} userEmail={user.email} active={profileActive} setActive={setProfileActive} action={true} header={"Профиль"} />
            <Backdrop open={isLoading}>
                <CircularProgress />
            </Backdrop>

            <div id="addGap"></div>
            <footer>
                <a href="https://vk.com/fanis_ng" target="_blank"><i className="fa-brands fa-vk"></i></a>
                <a href="https://t.me/fanis_ng" target="_blank"><i className="fa-brands fa-telegram"></i></a>
                <a href="https://www.youtube.com/@fanisnigamadyanov8262/featured" target="_blank"><i className="fa-brands fa-youtube"></i></a>
            </footer>
        </div>
    );
}
export default Predict;