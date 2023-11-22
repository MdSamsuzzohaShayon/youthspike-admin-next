import { ILeague } from '@/types/league';
import Link from 'next/link';
import React, { useState } from 'react';

interface ILeagueCardProps {
    league: ILeague;
    copyLeague: (e: React.SyntheticEvent, leagueId: string) => void;
}

// Create an array of month names
const monthNames: string[] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];


function LeagueCard({ league, copyLeague }: ILeagueCardProps) {

    const [actionOpen, setActionOpen] = useState<boolean>(false);

    const handleCopyLeague = (e: React.SyntheticEvent, leagueId: string) => {
        e.preventDefault();
        setActionOpen(false);
        copyLeague(e, leagueId);
    }

    const handleOpenAction = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setActionOpen(prevState => !prevState);
    }

    return (
        <div key={league._id} style={{ width: '48.5%' }} className="box mb-1 p-2 h-48 bg-gray-700 flex justify-around items-center flex-col gap-2 rounded-md relative">
            <ul className={`${actionOpen ? 'flex' : 'hidden'} flex-col justify-start items-start gap-1 py-2 px-4 bg-gray-900 absolute top-7 right-3 z-10 rounded-lg`}>
                <li role="presentation" onClick={(e) => handleCopyLeague(e, league._id)}>Copy</li>
                <li> <Link href={`/${league._id}/settings`}>Edit</Link></li>
            </ul>
            <div className="w-full flex justify-end">
                <img src="/icons/dots-vertical.svg" alt="dot-vertical" role="presentation" onClick={handleOpenAction} className="w-4 svg-white" />
            </div>
            <Link href={`/${league._id}`}>
                <div className="img-wrapper w-full flex justify-center items-center">
                    <img src="/free-logo.svg" alt="plus" className="w-12" />
                </div>
                <div className="text-box text-center">
                    <h3 className='text-lg font-bold mb-0'>{league.name}</h3>
                    <p style={{ fontSize: '0.7rem' }} >
                        {`${monthNames[new Date(league.startDate).getMonth()]} ${new Date(league.startDate).getDate()}, ${new Date(league.startDate).getFullYear()} `} - {`${monthNames[new Date(league.endDate).getMonth()]} ${new Date(league.endDate).getDate()}, ${new Date(league.endDate).getFullYear()} `}</p>
                    <p>Idaho, Fall, ID</p>
                </div>
            </Link>
        </div>
    )
}

export default LeagueCard