import React, { useState } from 'react';
import TransLimitations from "../Components/Transactions/TransLimitations";

function PTransLimitations() {
    const [modal, setModal] = useState(false);
    return (
        <div className="App">
            <TransLimitations />
        </div>
    );
}
export default PTransLimitations;
