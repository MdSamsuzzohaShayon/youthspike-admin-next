'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import MenuItem from './MenuItem';

function Menu() {
    const [openMenu, setOpenMenu] = useState(false);

    const openMenuHandler = () => {
        setOpenMenu(true);
    };

    const closeMenuHandler = () => {
        setOpenMenu(false);
    };

    return (
        <div className='container px-2 mx-auto'>
            {!openMenu && (
                <button onClick={openMenuHandler} className='menu-button'>
                    <img src='/icons/menu.svg' className='w-10 mt-4 svg-white' alt='menu' role="presentation" />
                </button>
            )}

            {openMenu && (
                <div className="menu-content bg-gray-700 w-4/6 absolute h-full top-0 left-0 z-20 p-4">
                    <div className="w-full flex justify-end items-center">
                        <button onClick={closeMenuHandler} className='close-button'>
                            <img src='/icons/close.svg' className='w-10 svg-white' alt='close' role="presentation" />
                        </button>
                    </div>
                    <ul className='menu-list'>
                        <MenuItem icon="/icons/setting.svg" text="Setting" />
                        <MenuItem icon="/icons/teams.svg" text="Teams" />
                        <MenuItem icon="/icons/players.svg" text="Players" />
                        <MenuItem icon="/icons/trophy.svg" text="Matches" />
                        <MenuItem icon="/icons/sports-man.svg" text="Account" />
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Menu;