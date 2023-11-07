/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef, useState } from 'react';
import { useUser } from '@/lib/UserProvider';
import { ADD_UPDATE_LEAGUE, GET_LEAGUES } from '@/graphql/league';
import { useMutation, useQuery } from '@apollo/client';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';
import LeagueAdd from '@/components/league/LeagueAdd';
import { ILeague } from '@/types/league';

interface IItem {
  id: number;
  text: string;
}

const itemList: IItem[] = [
  { id: 1, text: 'Upcoming' },
  { id: 2, text: 'A-Z' },
  { id: 3, text: 'Upcoming Matches' },
  { id: 4, text: 'Orlando' }
];


// Create an array of month names
const monthNames: string[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function LeaguesPage() {

  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [actionOpen, setActionOpen] = useState<string | null>(null);

  const filterListEl = useRef<HTMLDialogElement | null>(null);
  const leagueAddEl = useRef<HTMLDialogElement | null>(null);
  const user = useUser();

  const { loading, error, data: leaguesData } = useQuery(GET_LEAGUES);

  const handleFilter = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!filterListEl.current) return;
    filterListEl.current.showModal();
  }

  const handleSelectItem = (e: React.SyntheticEvent, iid: number) => {
    e.preventDefault();
    const alreadyExist = filteredItems.find((fl) => fl.id === iid);
    const findItem = itemList.find((il) => il.id === iid);
    if (!findItem || alreadyExist) return;
    setFilteredItems(prevState => [...prevState, findItem]);
  }

  const handleClose = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (filterListEl.current) filterListEl.current.close();
    if (leagueAddEl.current) leagueAddEl.current.close();
  }

  const handleRemoveFilter = (e: React.SyntheticEvent, iid: number) => {
    e.preventDefault();
    setFilteredItems(prevState => [...prevState.filter((fi) => fi.id !== iid)]);
  }

  const handleCopyLeague = (e: React.SyntheticEvent, leagueId: string) => {
    e.preventDefault();
    setActionOpen(null);
  }

  const handleEditLeague = (e: React.SyntheticEvent, leagueId: string) => {
    e.preventDefault();
    setActionOpen(null);
  }

  const handleOpenAction = (e: React.SyntheticEvent, leagueId: string) => {
    e.preventDefault();
    setActionOpen(leagueId);
  }

  const handleOpenAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (leagueAddEl.current) leagueAddEl.current.showModal();
  }

  console.log({ leaguesData });


  if (loading) return <Loader />;
  if (error) {
    let err = JSON.stringify(error);
    if (error.message === 'Forbidden resource') err = 'You do not have permission to do this operation!';
    return <Message text={err} />
  }

  return (
    <div className="container px-2 mx-auto">
      <dialog ref={leagueAddEl} >
        <img src="/icons/close.svg" alt="close" className="w-6 svg-black" role="presentation" onClick={handleClose} />
        <h3>New League</h3>
        <LeagueAdd handleClose={handleClose} />
      </dialog>
      <dialog ref={filterListEl}>
        <img src="/icons/close.svg" alt="close" className="w-6 svg-black" role="presentation" onClick={handleClose} />
        {itemList.map((item) => <p key={item.id} role="presentation" onClick={(e) => handleSelectItem(e, item.id)} >{item.text}</p>)}
      </dialog>
      <h1 className='mb-4 text-2xl font-bold pt-6'>Leagues Director</h1>
      <div className="filter flex justify-between mb-2">
        <h3>All Events</h3>
        <h3 className='flex items-center justify-between' role="presentation" onClick={handleFilter}>Filters <span><img src="/icons/filter.svg" className="svg-white w-6 ml-2 p-0 m-0 text-white" alt="filter" /></span></h3>
      </div>
      <div className="filtered-elements flex flex-wrap gap-2 mb-4">
        {filteredItems.map((item) => <p key={item.id} className='px-4 py-2 rounded-full bg-gray-800 flex items-center justify-between'>{item.text} <span onClick={(e) => handleRemoveFilter(e, item.id)}><img src='/icons/close.svg' className='svg-white w-6 ml-2 p-0 m-0' alt='close' /></span></p>)}
      </div>
      <div className="leagues-add-new flex flex-wrap gap-2 justify-between">
        <div style={{ width: '48.5%' }} className="box mb-1 p-2 h-48 bg-yellow-500 flex justify-center items-center flex-col gap-2 rounded-md" role="presentation" onClick={handleOpenAdd}>
          <img src="/icons/plus.svg" alt="plus" className="w-12 svg-white" />
          <p>Add New</p>
        </div>
        {leaguesData && leaguesData.getLeagues.code === 200 && leaguesData.getLeagues.data.map((league: ILeague) => (
          <div key={league._id} style={{ width: '48.5%' }} className="box mb-1 p-2 h-48 bg-gray-700 flex justify-around items-center flex-col gap-2 rounded-md relative">
            <ul className={`${actionOpen === 'leagueId_some_league_id' ? 'flex' : 'hidden'} flex-col justify-start items-start gap-1 py-2 px-4 bg-gray-900 absolute top-7 right-3 z-10 rounded-lg`}>
              <li role="presentation" onClick={(e) => handleCopyLeague(e, 'leagueId')}>Copy</li>
              <li role="presentation" onClick={(e) => handleEditLeague(e, 'leagueId')} >Edit</li>
            </ul>
            <div className="w-full flex justify-end">
              <img src="/icons/dots-vertical.svg" alt="dot vertical" role="presentation" onClick={(e) => handleOpenAction(e, 'leagueId_some_league_id')} className="w-4 svg-white" />
            </div>
            <img src="/free-logo.svg" alt="plus" className="w-15" />
            <div className="text-box text-center">
              <h3 className='text-lg font-bold mb-0'>{league.name}</h3>
              <p style={{ fontSize: '0.7rem' }} >
                {`${monthNames[new Date(league.startDate).getMonth()]} ${new Date(league.startDate).getDate()}, ${new Date(league.startDate).getFullYear()} `} - {`${monthNames[new Date(league.endDate).getMonth()]} ${new Date(league.endDate).getDate()}, ${new Date(league.endDate).getFullYear()} `}</p>
              <p>Idaho, Fall, ID</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeaguesPage;