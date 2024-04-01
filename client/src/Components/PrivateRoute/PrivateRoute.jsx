import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }
    else {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Декодируем токен и получаем его содержимое
        const currentTime = Date.now() / 1000; // Текущее время в секундах

        if (decodedToken.exp && decodedToken.exp <= currentTime) {
            // Если время истечения токена прошло, перенаправляем на страницу логина
            return <Navigate to="/login" />;
        } else {
            // В противном случае, перенаправляем на защищенный маршрут
            return <Outlet />;
        }
    }
};

export default PrivateRoute;