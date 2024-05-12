import React, { useEffect, useState, useContext } from 'react';
import './Modal.css'
import axios from "axios";
import SingleSelect from "../DropDown/DropDownSingle";
import MyDatePicker from "../DatePicker/DatePicker";
import { UserTransactionContext } from '../../Context';


const ModalEditInfo = ({ setEditInfoActive, setIsLoading, editInfoActive }) => {


    const { user, setUser, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes } = useContext(UserTransactionContext);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setEmail(user.email);
        setBalance(user.balance);
    }, [editInfoActive]);

    async function handleUpdateUserInfo() {
        if (!firstname) {
            alert('Введите фамилию!');
            return;
        } else if (!lastname) {
            alert('Введите имя!');
            return;
        } else if (!email) {
            alert('Введите email!');
            return;
        } else if (!balance) {
            alert('Введите баланс!');
            return;
        }

        const updateUser = {
            id: user.id,
            lastname: lastname,
            firstname: firstname,
            email: email,
            balance: balance,
        };
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found in localStorage');
            return;
        }

        setIsLoading(true);
        try {
            axios.post('http://localhost:5000/user/updateUser', updateUser, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(res => {
                    console.log(res.data.user);
                    setUser(res.data.user)
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });

        } catch (error) {
            console.error(error.message);
            alert('Произошла ошибка при создании транзакции');
        }


        setIsLoading(false);
    }

    return (
        <div className={editInfoActive ? "modal active" : "modal"} onClick={function () { setEditInfoActive(false) }}>
            <div className="modal__content" onClick={e => e.stopPropagation()}>

                <h1>Имя:</h1>
                <input type="text" value={lastname} placeholder={"Введите имя"} onChange={(e) => setLastname(e.target.value )} required />


                <h1>Фамилия:</h1>
                <input type="text" value={firstname} placeholder={"Введите фамилию"} onChange={(e) => setFirstname(e.target.value)} required />

                <h1>Email:</h1>
                <input type="text" value={email} placeholder={"Введите email"} onChange={(e) => setEmail(e.target.value)} required />

                <h1>Баланс:</h1>
                <input type="number" value={balance} placeholder={"Введите баланс"} onChange={(e) => setBalance(e.target.value )} required />
                <br/>
                <button onClick={handleUpdateUserInfo}>Изменить</button>
            </div>
        </div>
    );
};
export default ModalEditInfo;