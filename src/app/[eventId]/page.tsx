'use client'

import React, { useState, useRef, useEffect } from 'react';
import TeamCard from '@/components/teams/TeamCard';
import TeamAdd from '@/components/teams/TeamAdd';
import { useApolloClient, useLazyQuery, useQuery, gql } from '@apollo/client';
import { GET_TEAMS_BY_LEAGUE } from '@/graphql/teams';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';

interface ITeamsOfLeaguePage {
    params: {
        eventId: string
    }
}

function TeamsOfLeaguePage({ params }: ITeamsOfLeaguePage) {

    const client = useApolloClient();
    const teamAddEl = useRef<HTMLDialogElement | null>(null);
    const [showFilter, setShowFilter] = useState<boolean>(false);

    /**
     * Fetch all teams of this league from GraphQL Server
     */
    const [getTeams, { data: teamData, loading, error }] = useLazyQuery(GET_TEAMS_BY_LEAGUE);
    console.log({ teamData });



    const handleDivisionSelection = (e: React.SyntheticEvent) => {
        e.preventDefault();
        /**
         * Filter items
         */

    }

    const handleOpenAdd = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (teamAddEl.current) teamAddEl.current.showModal();
    }

    const handleClose = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (teamAddEl.current) teamAddEl.current.close();
    }

    const handleFilter = (e: React.SyntheticEvent, filteredItemId: number) => {
        e.preventDefault();
    }

    useEffect(() => {
        if (params?.eventId) {
            getTeams({ variables: { leagueId: params.eventId } });
        }
    }, [params.eventId]);

    if (loading) return <Loader />;

    return (
        <div className="container px-2 mx-auto">
            <dialog ref={teamAddEl} >
                <img src="/icons/close.svg" alt="close" className="w-6 svg-black" role="presentation" onClick={handleClose} />
                <h3>New League</h3>
                <TeamAdd handleClose={handleClose} />
            </dialog>
            {/* <dialog ref={filterListEl}>
      <img src="/icons/close.svg" alt="close" className="w-6 svg-black" role="presentation" onClick={handleClose} />
      {itemList.map((item) => <p key={item.id} role="presentation" onClick={(e) => handleSelectItem(e, item.id)} >{item.text}</p>)}
    </dialog> */}
            <h1 className='mb-4 text-2xl font-bold pt-6 text-center mb-8'>Teams</h1>
            {error && <Message error={error} />}
            <div className="w-full flex justify-between items-center flex-col mb-4">
                <div className="logo w-20">
                    <img src="/free-logo.svg" alt="program-playoffs" className='w-full' />
                </div>
                <h3 className='text-2xl'>Program Playoffs</h3>
                <p className="date flex mt-2"><span><img src="/icons/clock.svg" alt="clock" className='w-6 svg-white mr-2' /></span> Apr 5, 2024 - Apr 5, 2024</p>
                <p className="date flex mt-2"><span><img src="/icons/location.svg" alt="location" className='w-6 svg-white mr-2' /></span> Orlando, Florida</p>
            </div>
            <div className="mb-4 division-selection w-full">
                <select name="division" id="division" defaultValue='null' className="py-3 px-2 w-full bg-gray-100 text-gray-900 outline-none rounded-full overlofw-hidden" onChange={handleDivisionSelection} >
                    <option className='w-full' value="null" disabled >Division Selection</option>
                    <option className='w-full' value="division-1" >Division 1</option>
                    <option className='w-full' value="division-2" >Division 2</option>
                    <option className='w-full' value="division-3" >Division 3</option>
                </select>
            </div>
            <div className="mb-8 make-team flex w-full justify-between">
                <button onClick={handleOpenAdd} className="bg-yellow-500 text-gray-900 px-4 py-3 rounded-full flex justify-between gap-2 font-bold"><span><img src="/icons/plus.svg" alt="plus" className='w-6 svg-black' /></span>Add New Team</button>
                <button className="bg-yellow-500 text-gray-900 px-4 py-3 rounded-full flex justify-between gap-2 font-bold"><span><img src="/icons/import.svg" alt="import" className='w-6 svg-black' /></span>Import File</button>
            </div>
            <div className="list-with-filter w-full relative">
                <div className="action-section flex justify-between mb-4">
                    <div className="input-group flex items-center gap-2 justify-between">
                        <input type="checkbox" name="bulkaction" id="bulk-action" />
                        <label htmlFor="bulk-action">Bulk Action</label>
                        <img src="/icons/dropdown.svg" alt="dropdown" className="w-6 svg-white" />
                    </div>
                    <div className="input-group flex items-center gap-2 justify-between" role="presentation" onClick={(e) => setShowFilter((prevState) => !prevState)} >
                        <p>A-Z</p>
                        <img src="/icons/dropdown.svg" alt="dropdown" className="w-6 svg-white" />
                    </div>
                    <ul className={`${showFilter ? 'flex' : 'hidden'} flex-col justify-start items-start gap-1 py-2 px-4 bg-gray-900 absolute top-7 right-3 z-10 rounded-lg`}>
                        <li role="presentation" onClick={(e) => handleFilter(e, 1)}>Copy</li>
                        <li role="presentation" onClick={(e) => handleFilter(e, 2)} >Edit</li>
                    </ul>
                </div>
                <div className="team-list flex flex-col justify-between items-center gap-3">
                    <TeamCard />
                    <TeamCard />
                    <TeamCard />
                    <TeamCard />
                </div>
            </div>
        </div>
    )
}

export default TeamsOfLeaguePage;