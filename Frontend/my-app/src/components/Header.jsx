import React from 'react';
import AlgorandLogo from "../assets/image.png"
import '../css/Header.css';

export default function Header() {
    return (
        <header>
            <img src={AlgorandLogo}/>
            <h1>Bounty Board</h1>
        </header>
    )
}