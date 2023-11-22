/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef, useState } from 'react';
import { ADD_UPDATE_LEAGUE, GET_LEAGUES } from '@/graphql/league';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Loader from '@/components/elements/Loader';
import Message from '@/components/elements/Message';
import DirectorAdd from '@/components/ldo/DirectorAdd';
import { GET_LDO } from '@/graphql/director';
import { IDirector, ILDO } from '@/types';

function AccountPage() {
  const [ldoState, setLdoState] = useState<ILDO | null>(null);

  const [getLdo, { loading, error, data: ldoData }] = useLazyQuery(GET_LDO);
  // Query for director

  useEffect(() => {
    /**
     * Fetch director
     */
    (async () => {
      const { data } = await getLdo(); // Use dynamic id // use either ldoId or directorId
      const ldoObj = data?.getLeagueDirector?.data;    
      
      setLdoState({
        name: ldoObj?.name,
        logo: ldoObj?.logo,
        director: {
          email: ldoObj?.director?.login?.email,
          firstName: ldoObj?.director?.firstName,
          lastName: ldoObj?.director?.lastName,
          password: '',
          confirmPassword: '',
        }
      })
    })()
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message error={error} />

  return (
    <div className="container px-2 mx-auto">
      <h1 className='mb-4 text-2xl font-bold pt-6 text-center'>Account Setting (LDO)</h1>
      <DirectorAdd update prevLdo={ldoState} />
    </div>
  )
}

export default AccountPage;