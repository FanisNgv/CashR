import React, { useState } from 'react';
import Profile from "../Components/Profile/Profile";

function PProfile() {
    const [modal, setModal] = useState(false);
    return (
        <div className="App">
            <Profile />
        </div>
    );
}
export default PProfile;
