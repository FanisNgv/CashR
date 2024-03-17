import React from 'react';
import './Home.css'
import {Link} from "react-router-dom";
const Home = () => {
    return (
        <div className="Home">
            <header>
                <div className="MainBar">
                    <h1 className="Logo">CashR</h1>
                    <div className="RegAuth">
                        <Link to="/login" className="BarText">Войти</Link>
                        <Link to="/registration" className="BarText">Регистрация</Link>
                    </div>
                </div>
            </header>

            <div className="aligner">
                <div className="MainText text-1">
                    Это
                </div>
                <div className="MainText text-2">
                    CashR
                </div>
            </div>

            <div className="MainText text-3">
                Следить за финансами будет проще
            </div>
        </div>
    );
};

export default Home;