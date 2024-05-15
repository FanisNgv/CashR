import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Router, Routes} from "react-router-dom";
import PHome from "./Pages/home";
import PLogin from "./Pages/login"
import PRegistration from "./Pages/registration"
import PTransactions from "./Pages/transactions"
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import PTransAnalyse from './Components/Transactions/TransAnalyse';
import {UserTransactionProvider} from './Context';
import PPredict from "./Components/Transactions/Predict";
import PProfile from "./Components/Profile/Profile";
import PTransLimitations from "./Components/Transactions/TransLimitations";




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

                <Route exct path='/predict' element={<PrivateRoute />}>
                    <Route exact path='/predict' element={<PPredict />} />
                </Route>

                <Route exct path='/profile' element={<PrivateRoute />}>
                    <Route exact path='/profile' element={<PProfile />} />
                </Route>

                <Route exct path='/limitations' element={<PrivateRoute />}>
                    <Route exact path='/limitations' element={<PTransLimitations />} />
                </Route>

            </Routes>
            }
        </BrowserRouter>
        </UserTransactionProvider>

    );
}

export default App;
