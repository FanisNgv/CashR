import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Router, Routes} from "react-router-dom";
import PHome from "./Pages/home";
import PLogin from "./Pages/login"
import PRegistration from "./Pages/registration"
import PTransactions from "./Pages/transactions"
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import PTransAnalyse from './Components/Transactions/TransAnalyse';
import {UserTransactionProvider} from './Context';





function App() {
    return (
        < UserTransactionProvider>

        <BrowserRouter>
            {<Routes>
                <Route path="/" element={<PHome />} />
                <Route path="/login" element={<PLogin />} />
                <Route path="/registration" element={<PRegistration />}/>

                <Route exct path='/transactions' element={<PrivateRoute />}>
                    <Route exact path='/transactions' element={<PTransactions />} />
                </Route>

                    <Route exct path='/transAnalyse' element={<PrivateRoute />}>
                    <Route exact path='/transAnalyse' element={<PTransAnalyse />} />
                </Route>

            </Routes>
            }
        </BrowserRouter>
        </UserTransactionProvider>

    );
}

export default App;
