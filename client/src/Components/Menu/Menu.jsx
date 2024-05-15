import React from 'react';
import './Menu.css';

const Menu = ({ header, items, active, setActive, action }) => {
    return (
        <div>
            {active && <div className="blur" />}
            <div className={active ? 'menu active' : 'menu'} onClick={() => setActive(false)}>
                <div className="menu__content" onClick={e => e.stopPropagation()}>
                    <div className="menu__header">{header}</div>
                    <ul>
                        {items.map(item =>
                            <li>
                                <p onClick={item.action}>{item.value}</p>
                                {item.icon === "coin" && <span className="material-symbols-outlined">payments</span>}
                                {item.icon === "logout" && <span className="material-symbols-outlined">logout</span>}
                                {item.icon === "trans" && <span className="material-symbols-outlined">currency_exchange</span>}
                                {item.icon === "analyse" && <span className="material-symbols-outlined">leaderboard</span>}
                                {item.icon === "predict" && <span class="material-symbols-outlined">monitoring</span>}
                                {item.icon === "limitations" && <span class="material-symbols-outlined">credit_card_off</span>}

                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Menu;
