'use client'

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import MenuItem from './MenuItem';
import { useUser } from '@/lib/UserProvider';
import { UserRole } from '@/types/user';
import { IMenuItem } from '@/types';
import { gql, useApolloClient, useReadQuery } from '@apollo/client';
import { GET_LDO } from '@/graphql/director';
import { AdvancedImage } from '@cloudinary/react';
import cld from '@/config/cloudinary.config';
import Link from 'next/link';
import { getCookie } from '@/utils/cookie';

const eventPaths: string[] = ['settings', 'teams', 'players', 'matches', 'account', 'newevent', 'admin'];

const initialUserMenuList: IMenuItem[] = [
    {
        id: 1,
        imgName: 'setting',
        text: 'Settings',
        link: '/settings' // // Event settings
    },
    {
        id: 2,
        imgName: 'teams',
        text: 'Teams',
        link: '/teams'
    },
    {
        id: 3,
        imgName: 'players',
        text: 'Players',
        link: '/players'
    },
    {
        id: 4,
        imgName: 'trophy',
        text: 'Matches',
        link: '/matches'
    },
    {
        id: 5,
        imgName: 'account',
        text: 'Account',
        link: '/account'
    },
    {
        id: 6,
        imgName: 'account',
        text: 'Admin',
        link: '/admin'
    },
    {
        id: 7,
        imgName: 'account',
        text: 'LDO',
        link: '/admin/directors'
    },
];

function Menu() {
    /**
     * For home/ leagues page show only account option
     * Add logo to the top for league director organization
     * If user is captain show only matches and teams
     * Show setting, teams, matches, players option and event name if the user has a eventId
     * Create LDO or League Director Organization from the backend
     */
    const router = useRouter();
    const pathname = usePathname();
    const user = useUser();
    const client = useApolloClient();

    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string | null>(null);
    const [userMenuList, setUserMenuList] = useState<IMenuItem[]>(initialUserMenuList);

    const openMenuHandler = () => {
        user.info && user.token && user.token !== '' ? setOpenMenu(true) : setOpenMenu(false);
    };

    const closeMenuHandler = () => {
        setOpenMenu(false);
    };


    const handleLogout = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsAuthenticated(false);
        setOpenMenu(false);
        document.cookie = `token=;`;
        document.cookie = `user=;`;
        router.push('/login');
    }

    /**
     * Using Cache
     */
    const data = client.readQuery({ query: GET_LDO, });
    const ldoData = data?.getLeagueDirector?.data;
    



    /**
     * Mount hooks
     */
    useEffect(() => {
        const pathList = pathname.split('/');
        let eventPath = pathList.length > 0 ? pathList[1] : null;
        if (eventPath && eventPath.length < 5) eventPath = null;
        if (eventPath && eventPaths.includes(eventPath)) eventPath = null;

        if (!eventPath || eventPath === '') {
            setEventId(null);

            if (user.info?.role === UserRole.admin) {
                setUserMenuList([...initialUserMenuList.filter((menuItem) => menuItem.id === 6 || menuItem.id === 7)]); // Admin and directors
            } else {
                setUserMenuList([...initialUserMenuList.filter((menuItem) => menuItem.id === 5)]); // 5 = account
            }
        } else {
            setEventId(eventPath);
            if (user.info?.role === UserRole.director) {
                setUserMenuList((prevState) => [...prevState.filter((menuItem) => menuItem.id !== 6 && menuItem.id !== 7)]); // 2 = teams // 4 = matches
            } else {
                setUserMenuList(initialUserMenuList);
            }
        }

        const instantToken = getCookie('token'); // Fetch again
        instantToken ? setIsAuthenticated(true) : setIsAuthenticated(false);

    }, [user, router, pathname]);

    /**
     * Renders sub components
     */
    const renderMenuItems = (eId: string | null, uml: IMenuItem[]) => {
        const menuItems: React.ReactNode[] = [];
        for (let i = 0; i < uml.length; i++) {
            let newLink: string = '';
            if (eId && eId !== '' && (uml[i].id === 1 || uml[i].id === 3 || uml[i].id === 4)) newLink = '/' + eId;
            menuItems.push(<MenuItem setOpenMenu={setOpenMenu} key={uml[i].id} icon={`/icons/${uml[i].imgName}.svg`} text={uml[i].text} link={`${newLink}${uml[i].link}`} />);
        }

        return <>{menuItems}</>;
    }

    // if (!user.info || !user.token || user.token === '') return null;

    return (
        <div className='container px-2 mx-auto'>
            {isAuthenticated && (
                <button onClick={openMenuHandler} className='menu-button block md:hidden'>
                    <img src='/icons/menu.svg' className='w-10 mt-4 svg-white' alt='menu' />
                </button>
            )}

            {openMenu && (
                <div className="menu-content bg-gray-700 w-5/6 absolute h-full top-0 left-0 z-20 p-4">
                    <div className="w-full flex justify-end items-center">

                        {user && user.info && (
                            <button onClick={closeMenuHandler} className='close-button'>
                                <img src='/icons/close.svg' className='w-10 svg-white' alt='close' />
                            </button>
                        )}
                    </div>
                    <div className="league-director w-full flex justify-between items-center mb-8">
                        {user && user.info && user.info.role === UserRole.admin ? (<h1 className='text-2xl'>Admin</h1>) : (<>
                            <Link role="presentation" onClick={closeMenuHandler} href="/">
                                {ldoData?.logo ? <AdvancedImage className="w-2/6" cldImg={cld.image(ldoData?.logo)} /> : <img src="/free-logo.svg" alt="spikeball-logo" className="w-2/6" />}
                            </Link>
                            <h1 className='text-2xl'>{ldoData ? ldoData.name : ''}</h1>
                        </>)}
                    </div>
                    {eventId && (
                        <div className="league mb-8 w-full">
                            <h2 className='text-xl'>League Name</h2>
                        </div>
                    )}
                    <ul className='menu-list flex justify-start flex-col gap-8'>
                        {renderMenuItems(eventId, userMenuList)}
                        {(user && user.token && user.token !== '') && <li><button className="btn-danger" onClick={handleLogout}>Logout</button></li>}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Menu;