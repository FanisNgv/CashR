import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => { // Принимаем children в качестве аргумента
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    } else {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp <= currentTime) {
            return <Navigate to="/login" />;
        } else {
            // Отображаем дочерние маршруты
            return <Outlet />; // Используем Outlet для отображения дочерних маршрутов
        }
    }
};

export default PrivateRoute;
