'use client'

import DirectorAdd from '@/components/director/DirectorAdd';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';
import { GET_LDO, GET_LDOS } from '@/graphql/director';
import { useApolloClient, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';

function LDOSingle({ params }: { params: { ldoId: string } }) {

  const { data, error, loading } = useQuery(GET_LDO, {variables: {dId: params.ldoId}})

  if (loading) return <Loader />;


  return (
    <div className='container mx-auto px-2'>
      <p>Fetch director by Id</p>
      <p>Get ldo from cache from cache and use that as default value in director add</p>
      <h2>Update Director</h2>
      {error && <Message error={error} />}
      <DirectorAdd update prevLdo={data?.getLeagueDirector?.data} />
    </div>
  )
}


export default LDOSingle;