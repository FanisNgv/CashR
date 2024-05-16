import React, { useEffect, useState, useContext } from 'react';
import './Profile.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backdrop, CircularProgress } from '@mui/material';

import { UserTransactionContext } from '../../Context'; // Импортируем контекст
import ModalEditInfo from '../Modals/ModalEditInfo';
import ModalAddCategory from '../Modals/ModalAddCategory';
import Menu from "../Menu/Menu";


const Profile = () => {
    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);
    const [isLoading, setIsLoading] = useState();
    const [menuActive, setMenuActive] = useState(false);
    const [editInfoActive, setEditInfoActive] = useState(false);
    const [isCategoryIncome, setIsCategoryIncome] = useState(false);
    const [isCategoryOutcome, setIsCategoryOutcome] = useState(false);
    const [addCategoryActive, setAddCategoryActive] = useState(false);

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

    async function handleDeleteCategory(categoryId){

        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        try {
            const deleteCategoryResponse = await fetch('http://localhost:5000/user/deleteCategory', {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: categoryId }),
                });

            if (deleteCategoryResponse.ok) {
                const data = await deleteCategoryResponse.json();
                alert(data.message);
            } else {
                const errorData = await deleteCategoryResponse.json();
                alert(errorData.message);
            }

            const typesOfTransaction = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID: user.id }),
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
            setIsLoading(false);
            alert('Произошла ошибка при удалении категории');
        }
    };

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
    function handleTransLimitationsClick() {
        navigate('/limitations');
    }
    function toggleEditInfo(){
        setEditInfoActive(!editInfoActive);
    }

    async function toggleAddIncomeCategory(){
        setIsCategoryIncome(!isCategoryIncome);
        setAddCategoryActive(!addCategoryActive);
    }
    async function toggleAddOutcomeCategory(){
        setIsCategoryOutcome(!isCategoryOutcome);
        setAddCategoryActive(!addCategoryActive);
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

                const typesOfTransaction = await fetch('http://localhost:5000/user/getTypesOfTransactions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID: response.id }),
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
            <div style={{display: 'flex', justifyContent:'space-between'}}>
                <div className="MainInfo">
                    <h1 style={{ marginLeft: '25px', fontSize: '32px' }}>Информация о пользователе:</h1>
                    <h1>Имя: {user.lastname}</h1>
                    <h1>Фамилия: {user.firstname}</h1>
                    <h1>Баланс: {user.balance}&#8381;</h1>
                    <h1>Почта: {user.email}</h1>
                </div>
                <div style={{marginRight:'50px'}} className="Actions">
                    <h1 style={{ fontSize: '32px' }}>Действия:</h1>
                    <div className="quitElement">
                        <h1 onClick={handleLogoutClick} >Выйти из аккаунта</h1>
                        <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>logout</span>
                    </div>
                </div>
            </div>
            
            <button onClick={toggleEditInfo} style={{marginLeft: '65px'}}>Изменить данные</button>

            <div className="separator"></div>

            <div className="TransactionCategories">
                <h1 style={{ marginLeft: '25px', fontSize: '32px' }}>Управление категориями:</h1>
                <div className="categoriesContainer">
                    <div className="categoryColumn">
                        <h1 style={{fontSize: '32px', marginLeft:'60px'}}>Доходы</h1>
                        {typesOfIncomes.map((incomeCategory, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'baseline', border: '2px solid #EF233C', borderRadius:'10px', padding: '20px' }}>
                                <p style={{ marginBottom: 0 }}>{incomeCategory.name}</p>
                                <button type="button" onClick={() => handleDeleteCategory(incomeCategory.id) } style={{width: '100px'}}>Удалить</button>
                            </div>))}
                        <button onClick={toggleAddIncomeCategory} style={{ width: '100px', marginLeft: '70px' }}>Добавить</button>

                    </div>

                    <div className="categoryColumn">
                        <h1 style={{ fontSize: '32px', marginLeft: '60px' }}>Расходы</h1>
                        {typesOfOutcomes.map((outcomeCategory, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'baseline', border: '2px solid #EF233C', borderRadius: '10px', padding: '20px' }}>
                                <p style={{ marginBottom: 0 }}>{outcomeCategory.name}</p>
                                <button type="button" onClick={() => handleDeleteCategory(outcomeCategory.id)} style={{ width: '100px' }}>Удалить</button>
                            </div>                        
                        ))}
                        <button onClick={toggleAddOutcomeCategory} style={{ width: '100px', marginLeft: '70px' }}>Добавить</button>
                    </div>
                    
                </div>
            </div>
            <br />
            <ModalEditInfo setEditInfoActive = {setEditInfoActive} setIsLoading={setIsLoading} editInfoActive={editInfoActive}/>
            <ModalAddCategory setAddCategoryActive = {setAddCategoryActive} setIsLoading={setIsLoading} addCategoryActive={addCategoryActive} isCategoryIncome={isCategoryIncome} setIsCategoryIncome={setIsCategoryIncome} isCategoryOutcome={isCategoryOutcome} setIsCategoryOutcome={setIsCategoryOutcome}/>
            <Menu active={menuActive} setActive={setMenuActive} action={true} header={"Главное меню"}
                items={MenuItems} />
        </div>
        

    );
}
export default Profile;
