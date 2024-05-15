import React from 'react';
import './Menu.css';
const ProfileMenu = ({header, items, active, setActive, action, userBalance, userEmail}) => {
    return (
        <div className={active?'menu active':'menu'} onClick={()=>setActive(false)}>
            <div className="blur"/>
            <div className="menu__content" onClick={e=>e.stopPropagation()}>
                <div className="menu__header">{header}</div>
                <div id="balance">
                    <h1>Баланс:</h1>
                    <h1>{userBalance}р.</h1>
                </div>
                <div id="email">
                    <h1>Почта:</h1>
                    <h1>{userEmail}</h1>
                </div>
                <br/>
                <ul>
                    {items.map(item=>
                        <li>
                            <p onClick={item.action}>{item.value}</p>
                            {item.icon==="logout"&&<span className="material-symbols-outlined">logout</span>}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ProfileMenu;