import React, {useState} from 'react';
import Registration from "../Components/Registration/Registration";

function PRegistration() {
    const [modal, setModal] = useState(false);
    return (
        <div className="App">
            <Registration/>
        </div>
    );
}
export default PRegistration;
