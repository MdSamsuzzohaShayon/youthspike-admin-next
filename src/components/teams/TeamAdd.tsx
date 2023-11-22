import { ADD_LEAGUE, UPDATE_LEAGUE } from '@/graphql/league';
import { useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import Loader from '../elements/Loader';
import Message from '../elements/Message';

interface ITeamAdd {
    handleClose: (e: React.SyntheticEvent) => void;
}

function TeamAdd({ handleClose }: ITeamAdd) {
    const [name, setName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [playerLimit, setPlayerLimit] = useState<number | null>(null);

    // GraphQL
    // Get all coaches / players
    const [addLeague, { data, loading, error, reset }] = useMutation(ADD_LEAGUE); // Do caching
    

    const handleTeamAdd = async (e: React.SyntheticEvent) => {
        // e.preventDefault();
        const { data: resultData } = await addLeague({
            variables: {
                name, startDate, endDate, playerLimit, active: true
            }
        });

        console.log({ resultData });
        const formEl = e.target as HTMLFormElement;
        formEl.reset();
        handleClose(e);
    }

    useEffect(() => {
        return () => {
            reset();
        }
    }, []);

    // This should render on page level 
    if (loading) return <Loader />;
    if (error) {
        let err = JSON.stringify(error);
        if (error.message === 'Forbidden resource') err = 'You do not have permission to do this operation!';
        return <Message text={err} />
    }

    return (
        <form onSubmit={handleTeamAdd} className='flex flex-col gap-2'>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="name">Name</label>
                <input className='border border-gray-300 p-1' type="text" defaultValue={name} required onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="startDate">Start</label>
                <input className='border border-gray-300 p-1' type="datetime-local" defaultValue={startDate} required onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="endDate">End</label>
                <input className='border border-gray-300 p-1' type="datetime-local" defaultValue={endDate} required onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="playerLimit">Player Limit</label>
                <input className='border border-gray-300 p-1' type="number" required onChange={(e) => setPlayerLimit(parseInt(e.target.value, 10))} />
            </div>
            <div className="input-group w-full">
                <button className='border border-gray-300 bg-gray-900 text-gray-300 p-2' type='submit'>Create</button>
            </div>
        </form>
    )
}

export default TeamAdd;