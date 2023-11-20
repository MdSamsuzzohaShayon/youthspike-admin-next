'use client'

import DirectorAdd from '@/components/director/DirectorAdd';
import DirectorList from '@/components/director/DirectorList';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';
import { GET_LDOS } from '@/graphql/director';
import { useQuery } from '@apollo/client';
import React from 'react';

function DirectorPage() {
  /**
   * Show list of directors
   */
  const { data, loading, error } = useQuery(GET_LDOS);  

  if (loading) return <Loader />;
  if (error) return <Message error={error} />
  return (
    <div className='container mx-auto px-2'>
      <h1>Directors (Only accessable by admin)</h1>
      <DirectorAdd update={false} />
      <DirectorList ldoList={data?.getLeagueDirectors?.data} />
    </div>
  )
}

export default DirectorPage;