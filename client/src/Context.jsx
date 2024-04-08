// UserTransactionProvider.jsx
import React, { createContext, useContext, useState } from 'react';

export const UserTransactionContext = createContext();

export const UserTransactionProvider = ({ children }) => {
    const [user, setUser] = useState({
        lastname: " ",
        firstname: "",
        email: ""
    });
    const [transactions, setTransactions] = useState([]);

    return (
        <UserTransactionContext.Provider value={{ user, setUser, transactions, setTransactions }}>
            {children}
        </UserTransactionContext.Provider>
    );
};

export default UserTransactionProvider;
