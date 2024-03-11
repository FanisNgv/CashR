import React, { useState } from "react";
import "./LogReg.css";
import {useNavigate} from 'react-router-dom';

const Registration = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    function handleChangeFirstName(event) {
        setFirstName(event.target.value);
    }

    function handleChangeLastName(event) {
        setLastName(event.target.value);
    }
    function handleChangeEmail(event) {
        setEmail(event.target.value);
    }

    function handleChangePassword(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const user = {firstName, lastName, email, password};
        await fetch('http://localhost:5000/auth/registration', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(user),
        })
            .then(response => response.json())
            .then(data => {
                if (data.isRegistered) {
                    alert(data.message);
                    navigate('/login');
                }
                else{
                    alert(data.message);
                }

            })
            .catch(error => console.error(error));
    }

    return (
        <div className="auth_reg">
            <div className="title_text">
                <h1>Регистрация</h1>
            </div>
            <form className="auth_reg_form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={firstName}
                    placeholder={"Введите фамилию"}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    value={lastName}
                    placeholder={"Введите имя"}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    value={email}
                    placeholder={"Введите почту"}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    placeholder={"Введите пароль"}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );
};
export default Registration;
