import React from 'react';
import '../App.css';
import crypto from '../assets/crypto.png';

function Header() {

    return (
        <div className="Header">
            <h1><img src={crypto} alt=''></img> Crypto Merchants</h1>
        </div>
    );
}

export default Header;
