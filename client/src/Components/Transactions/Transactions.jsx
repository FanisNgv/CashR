import React, {useEffect, useState} from 'react';
import './Transactions.css';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Backdrop, CircularProgress} from '@mui/material';

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

    const [users, setUsers] = useState([]);
    const [menuActive, setMenuActive] = useState(false);
    const[profileActive, setProfileActive] = useState(false);
    const[modalFilterIsOpened, setModalFilterIsOpened] = useState(false);
    const navigate = useNavigate();

    const [come, setCome] = useState();
    const [addTransactionIsOpened, setAddTransactionIsOpened] = useState(false);
    const [typesOfOutcomes, setTypesOfOutcomes] = useState(["Еда", "Здоровье", "Спорт", "Жилье"]);
    const [typesOfIncomes, setTypesOfIncomes] = useState(["Зарплата", "Стипендия"]);
    const [transactions, setTransactions] = useState([]);
    const [sortedTransactions, setSortedTransactions] = useState([]);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    const[leftBorder, setLeftBorder] = useState();
    const[rightBorder, setRightBorder] = useState();

    const MenuItems = [{value: "Транзакции", action: handleTransClick, icon: "trans"},{
        value: "Анализ транзакций",
        action: handleTransAnalyseClick,
        icon: "analyse"
    }, {
        value: "Добавить расход/доход",
        action: handleAddTransClick,
        icon: "coin"
    }];

    const ProfileItems=[{value: "Выйти", action: handleLogoutClick, icon: "logout"}]

    function handleTransAnalyseClick(){
        navigate('/transAnalyse');
    }
    function handleTransClick(){
        navigate('/transactions');
    }
    function handleLogoutClick() {
        navigate('/login');
        localStorage.clear();
    }

    function handleAddTransClick() {
        setMenuActive(false);
        setAddTransactionIsOpened(true);
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
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({userID: response.id}),
                });

                const transactionsData = await transactionsResponse.json();
                setTransactions(transactionsData);


            } catch (error) {
                console.error(error.message);
            }

            setIsLoading(false);
        });
        fetchData();
    }, []);

    function getDateValue(dateString) {
        return new Date(dateString).getTime();
    }
    useEffect(()=>{
        const srtdTransactions = [...transactions].sort(function(a, b) {
            return getDateValue(b.dateOfTransaction) - getDateValue(a.dateOfTransaction);
        });
        setSortedTransactions(srtdTransactions);
    },[transactions])

    function toggleMenu() {
        setMenuActive(!menuActive);
    }
    function toggleProfile(){
        setProfileActive(!profileActive);
    }
    function toggleModalFilter(){
        setModalFilterIsOpened(!modalFilterIsOpened);
    }

    const[standartSet, setStandartSet] = useState([]);
    function getDateValue(dateString) {
        return new Date(dateString).getTime();
    }
    useEffect(()=>{
        const srtdTransactions = [...transactions].sort(function(a, b) {
            return getDateValue(b.dateOfTransaction) - getDateValue(a.dateOfTransaction);
        });
        setStandartSet(srtdTransactions);
    },[transactions])


    return (
        <div className="Transactions">
            <header>
                <div className="MainBar">
                    <h1 className="Logo" onClick={toggleMenu}>CashR</h1>
                    <div className="userName" onClick={toggleProfile}>
                        <div className="userIcon">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <h1>{user.lastname} {user.firstname}</h1>
                    </div>
                </div>
            </header>


        </div>
    );
};

export default MainPage;