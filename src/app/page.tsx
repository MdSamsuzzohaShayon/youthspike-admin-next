/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef, useState } from 'react';
import { useUser } from '@/lib/UserProvider';
import { ADD_UPDATE_LEAGUE, GET_LEAGUES } from '@/graphql/league';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';
import LeagueCard from '@/components/league/LeagueCard';
import { ILeague } from '@/types/league';
import { useRouter } from 'next/navigation';
import { GET_LDO } from '@/graphql/director';
import cld from '@/config/cloudinary.config';
import { AdvancedImage } from '@cloudinary/react';

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

function LeaguesPage() {

  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [actionOpen, setActionOpen] = useState<string | null>(null);

  const filterListEl = useRef<HTMLDialogElement | null>(null);
  const user = useUser();
  const router = useRouter();

  const { loading, error, data: leaguesData } = useQuery(GET_LEAGUES);
  const { loading: ldoLoading, error: ldoError, data: ldoData } = useQuery(GET_LDO);

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
  }

  const handleRemoveFilter = (e: React.SyntheticEvent, iid: number) => {
    e.preventDefault();
    setFilteredItems(prevState => [...prevState.filter((fi) => fi.id !== iid)]);
  }

  const handleOpenAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    router.push('/leagues/new')
  }


  if (loading || ldoLoading) return <Loader />;
  if (error || ldoError) {
    console.log(error, ldoError);

    // let err = JSON.stringify(error);
    // if (error.message === 'Forbidden resource') err = 'You do not have permission to do this operation!';
    return <Message text={error} />
  }

  const newLdoData = ldoData?.getLeagueDirector?.data;
  const leagueLogo = newLdoData ? cld.image(newLdoData?.logo) : null;
  return (
    <div className="container px-2 mx-auto">
      <dialog ref={filterListEl}>
        <img src="/icons/close.svg" alt="close" className="w-6 svg-black" role="presentation" onClick={handleClose} />
        {itemList.map((item) => <p key={item.id} role="presentation" onClick={(e) => handleSelectItem(e, item.id)} >{item.text}</p>)}
      </dialog>
      <h1 className='mb-4 text-2xl font-bold pt-6 text-center'>Leagues Director</h1>
      <div className="box w-full flex flex-col justify-center items-center mb-4">
        {leagueLogo ? <AdvancedImage className="w-12" cldImg={leagueLogo} /> : <img src="/free-logo.svg" alt="free-logo" className="w-12" />}

        <h1>{newLdoData ? newLdoData.name : ''}</h1>
        <h2 >Events</h2>
      </div>
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
          <LeagueCard key={league._id} actionOpen={actionOpen} league={league} setActionOpen={setActionOpen} />
        ))}
      </div>
    </div>
  )
}

export default LeaguesPage;