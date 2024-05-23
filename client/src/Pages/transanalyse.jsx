import React, {useState} from 'react';
import TransAnalyse from "../Components/Transactions/TransAnalyse";

function PTransAnalyse() {
    const [modal, setModal] = useState(false);
    return (
        <div className="App">
            <TransAnalyse/>
        </div>
    );
}
export default PTransAnalyse;
