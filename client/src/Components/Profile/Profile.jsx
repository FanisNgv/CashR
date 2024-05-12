import React, { useEffect, useState, useContext } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';

import { UserTransactionContext } from '../../Context'; // Импортируем контекст
import ModalEditInfo from '../Modals/ModalEditInfo';

const Profile = () => {
    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [isLoading, setIsLoading] = useState();
    const [menuActive, setMenuActive] = useState(false);
    const [editInfoActive, setEditInfoActive] = useState(false);
    const navigate = useNavigate();


    const MenuItems = [{ value: "Список транзакций", action: handleTransClick, icon: "trans" }, {
        value: "Анализ транзакций",
        action: handleTransAnalyseClick,
        icon: "analyse"
    }, {
        value: "Прогнозирование",
        action: handlePredictClick,
        icon: "predict"

    }];

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month].join('-');
    }

    function groupTransactionsByMonth(transactions) {
        let grouped = {};

        transactions.forEach(transaction => {
            let month = formatDate(transaction.dateOfTransaction);
            if (!grouped[month]) {
                grouped[month] = { date: month, income: 0, outcome: 0 };
            }
            if (transaction.come === 'Income') {
                grouped[month].income += parseFloat(transaction.valueOfTransaction);
            } else if (transaction.come === 'Outcome') {
                grouped[month].outcome -= parseFloat(transaction.valueOfTransaction);
            }
        });

        // Преобразуем объект в массив значений
        return Object.values(grouped);
    }

    function separateTransactionsByType(transactions) {
        const income = transactions.filter(t => t.come === 'Income');
        const outcome = transactions.filter(t => t.come === 'Outcome');

        return { income, outcome };
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
    function handleLogoutClick() {
        navigate('/login');
        localStorage.clear();
    }
    function toggleEditInfo(){
        setEditInfoActive(!editInfoActive);
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

            <div className="MainInfo">
                <p>Имя: {user.lastname}</p>
                <p>Фамилия: {user.firstname}</p>
                <p>Баланс: {user.balance}&#8381;</p>
                <p>Почта: {user.email}</p>
            </div>
            <button onClick={toggleEditInfo}>Изменить данные</button>
            <ModalEditInfo setEditInfoActive = {setEditInfoActive} setIsLoading={setIsLoading} editInfoActive={editInfoActive} typesOfIncomes={typesOfIncomes} typesOfOutcomes={typesOfOutcomes} user={user} setUser={setUser}/>
        </div>


    );
}
export default Profile;
