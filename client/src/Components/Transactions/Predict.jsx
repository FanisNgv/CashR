import React, { useEffect, useState, useContext } from 'react';
import './Transactions.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryZoomContainer, VictoryTheme, VictoryAxis } from 'victory';
import Menu from "../Menu/Menu";
import ProfileMenu from "../Menu/ProfileMenu";

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
    const [monthlyTransactions, setMonthlyTransactions] = useState([]); // Объявление monthlyTransactions здесь


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

    

    const ProfileItems = [{ value: "Выйти", action: handleLogoutClick, icon: "logout" }]

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

    function handleTransLimitationsClick() {
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
    function handleProfileClick(){
        navigate('/profile');
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
                setMonthlyTransactions(groupTransactionsByMonth(transactionsData)); 


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
    function toggleModalFilter() {
        setModalFilterIsOpened(!modalFilterIsOpened);
    }
    
    async function togglePredictTransactions() {

        if(monthlyTransactions.length <= 2){
            alert('Недостаточно данных для прогнозирования')
            return
        }

        try {
            const ML_Response = await fetch('http://127.0.0.1:8080/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Добавление заголовка Content-Type
                },
                body: JSON.stringify({ transactions: allTransactions }),
            });
            // Проверяем, что запрос прошел успешно
           // Преобразуем тело ответа в объект JSON
        const data = await ML_Response.json();

        // Извлекаем предсказанные значения из объекта data
        const income_predicted_value = data.income_predicted_value;
        const expense_predicted_value = data.expense_predicted_value;

        // Добавляем предсказанные значения для следующего месяца к monthlyTransactions
            // Добавляем предсказанные значения для следующего месяца к monthlyTransactions
            const nextMonthDate = new Date(monthlyTransactions[monthlyTransactions.length - 1].date);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            const nextMonth = formatDate(nextMonthDate);
            const predictedMonthData = {
                date: nextMonth,
                income: parseFloat(income_predicted_value), // Преобразование строки в число
                outcome: parseFloat(expense_predicted_value) // Преобразование строки в число
            };

            // Используем spread оператор для добавления прогнозированных данных в existing monthlyTransactions
            setMonthlyTransactions(prevTransactions => [...prevTransactions, predictedMonthData]);

        } catch (error) {
            console.error(error.message);
        }
    }
    

    const [standartSet, setStandartSet] = useState([]);
    monthlyTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const { income, outcome } = separateTransactionsByType(allTransactions);

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

            

            <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"} items={MenuItems} />
            <ProfileMenu items={ProfileItems} userBalance={user.balance} userEmail={user.email} active={profileActive} setActive={setProfileActive} action={true} header={"Профиль"} />
            <Backdrop open={isLoading}>
                <CircularProgress />
            </Backdrop>

            {/* Графики доходов и расходов */}
            <div className="graphContainer">
                <div className="graph">
                    <h2 style={{ fontSize: "24px", fontFamily: 'Noto Sans', color: 'white', marginTop: '20px' }}>Доходы</h2>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        width={350}
                        height={200}
                        containerComponent={<VictoryZoomContainer />}
                        domainPadding={{ x: [20, 20], y: [20, 20] }} // Добавление отступов по осям x и y

                    >
                        <VictoryAxis
                            style={{
                                grid: { stroke: "white", strokeWidth: 0.5 }, // Стили сетки
                                tickLabels: { fontSize: 8, fill: "white", fontFamily: 'Noto Sans' },
                                axis: { stroke: "white", strokeWidth: 1 }, // Стили оси
                                ticks: { size: 5, stroke: "white" }, // Стили меток оси
                                axisLabel: { fontSize: 10, padding: 20 }, // Стили названия оси
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{
                                grid: { stroke: "white", strokeWidth: 0.5 }, // Стили сетки
                                tickLabels: { fontSize: 8, fill: "white", fontFamily: 'Noto Sans'}, // Стили меток
                                axis: { stroke: "white", strokeWidth: 1 }, // Стили оси
                                ticks: { size: 5, stroke: "white" }, // Стили меток оси
                                axisLabel: { fontSize: 10, padding: 20 }, // Стили названия оси
                            }}
                            domain={[0, Math.max(...monthlyTransactions.map(month => month.income)) * 1.5]} // Устанавливаем диапазон оси Y

                        />
                        <VictoryLine
                            interpolation="natural"
                            data={monthlyTransactions.map(month => ({ x: month.date, y: month.income }))}
                            style={{ data: { stroke: "lawngreen", strokeWidth: 1 } }}
                        />
                        <VictoryScatter
                            data={monthlyTransactions.map(month => ({ x: month.date, y: month.income }))}
                            size={3}
                            style={{ data: { fill: "lawngreen" } }}
                        />
                        
                        
                    </VictoryChart>
                </div>

                <div className="graph">
                    <h2 style={{ fontSize: "24px", fontFamily: 'Noto Sans', color: 'white', marginTop: '20px' }}>Расходы</h2>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        width={350}
                        height={200}
                        containerComponent={<VictoryZoomContainer />}
                        domainPadding={{ x: [20, 20], y: [20, 20] }} // Добавление отступов по осям x и y

                    >
                        <VictoryAxis
                            style={{
                                grid: { stroke: "white", strokeWidth: 0.5 }, // Стили сетки
                                tickLabels: { fontSize: 8, fill: "white", fontFamily: 'Noto Sans' },
                                axis: { stroke: "white", strokeWidth: 1 }, // Стили оси
                                ticks: { size: 5, stroke: "white" }, // Стили меток оси
                                axisLabel: { fontSize: 10, padding: 20 }, // Стили названия оси
                            }}

                        />
                        <VictoryAxis
                            dependentAxis
                            style={{
                                grid: { stroke: "white", strokeWidth: 0.5 }, // Стили сетки
                                tickLabels: { fontSize: 8, fill: "white", fontFamily: 'Noto Sans' }, // Стили меток
                                axis: { stroke: "white", strokeWidth: 1 }, // Стили оси
                                ticks: { size: 5, stroke: "white" }, // Стили меток оси
                                axisLabel: { fontSize: 10, padding: 20 }, // Стили названия оси
                            }}
                            domain={[0, Math.max(...monthlyTransactions.map(month => month.outcome)) * 1.5]} // Устанавливаем диапазон оси Y

                        />
                        <VictoryLine
                            interpolation="natural"
                            data={monthlyTransactions.map(month => ({ x: month.date, y: month.outcome }))}
                            style={{ data: { stroke: "red", strokeWidth: 1 } }}
                        />
                        <VictoryScatter
                            data={monthlyTransactions.map(month => ({ x: month.date, y: month.outcome }))}
                            size={3}
                            style={{ data: { fill: "red" } }}
                        />
                    </VictoryChart>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <button onClick={togglePredictTransactions}>Спрогнозировать данные</button>
            </div>
        </div>
    );
}
export default Predict;
