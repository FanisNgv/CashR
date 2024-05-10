import React, { useState } from 'react';
import Predict from "../Components/Transactions/Predict";

function PPredict() {
    const [modal, setModal] = useState(false);
    return (
        <div className="App">
            <Predict />
        </div>
    );
}
export default PPredict;
