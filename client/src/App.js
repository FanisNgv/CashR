import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Router, Routes} from "react-router-dom";
import PHome from "./Pages/home";
import PLogin from "./Pages/login"
import PRegistration from "./Pages/registration"
import PTransactions from "./Pages/transactions"
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";



function App() {
    return (
        <BrowserRouter>
            {<Routes>
                <Route path="/" element={<PHome />} />
                <Route path="/login" element={<PLogin />} />
                <Route path="/registration" element={<PRegistration />}/>

                <Route exct path='/transactions' element={<PrivateRoute/>}>
                    <Route exact path='/transactions' element={<PTransactions/>}/>
                </Route>

                {/*<Route path="/registration" element={<PRegistration />} />
                <Route path="/login" element={<PLogin />} />

                <Route exact path='/users' element={<PrivateRoute/>}>
                    <Route exact path='/users' element={<PUsers/>}/>
                </Route>

                <Route exct path='/transactions' element={<PrivateRouteUser/>}>
                    <Route exact path='/transactions' element={<PMainPage/>}/>
                </Route>

                <Route exct path='/transAnalyse' element={<PrivateRouteUser/>}>
                    <Route exact path='/transAnalyse' element={<PTransAnalyse/>}/>
                </Route>*/}

            </Routes>
            }
        </BrowserRouter>
    );
}

export default App;
