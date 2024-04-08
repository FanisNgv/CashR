import React, {useState} from 'react';
import { UserTransactionProvider } from '../Context';

import Transactions from "../Components/Transactions/Transactions";

function TransactionsPage() {
    return (
        <div className="App">
            <Transactions/>
        </div>
    );
}
export default TransactionsPage;