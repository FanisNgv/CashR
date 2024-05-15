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
    const [typesOfOutcomes, setTypesOfOutcomes] = useState([]);
    const [typesOfIncomes, setTypesOfIncomes] = useState([]);

    return (
        <UserTransactionContext.Provider value={{ user, setUser, transactions, setTransactions, typesOfIncomes, setTypesOfIncomes, typesOfOutcomes, setTypesOfOutcomes }}>
            {children}
        </UserTransactionContext.Provider>
    );
};

export default UserTransactionProvider;
