'use client'

import CaptainCard from '@/components/player/CaptainCard';
import PlayerList from '@/components/player/PlayerList';
import { GET_A_TEAM } from '@/graphql/teams';
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';

interface TeamSingleProps {
  params: { teamId: string }
}

function TeamSingle({ params }: TeamSingleProps) {
  const { data } = useQuery(GET_A_TEAM, { variables: { teamId: params.teamId } });
  console.log(data);
  const teamData = data?.getTeam?.data;

  return (
    <div className='container mx-auto px-2'>
      <h1 className='uppercase text-center'>Teams/roster</h1>
      <a target='_blink' href="https://www.figma.com/proto/PoBQKYzuq9IgmCLZMVu9MT/Dashboard-for-spikeball-app-(Client-file)?type=design&node-id=201-1660&t=a8dHq7FKsr2km2dX-1&scaling=min-zoom&page-id=0%3A1">Figma Link (Page 6)</a>
      <p>League director can change captain </p>
      <p>Captain can change team player ranking</p>

      {/* Team detail  */}
      <div className="team-detail mt-8 w-full flex justify-center flex-col items-center">
        <img src="/free-logo.svg" className='w-20' alt={teamData && teamData.name} />
        <h3 className="capitalize">{teamData && teamData.name}</h3>
      </div>

      {/* Division section  */}
      <div className="division-section mt-8 w-full flex justify-between items-center">
        <div className="w-7/12">
          <button className="w-full btn-primary flex justify-between items-center">
            Division Selection <img src="/icons/dropdown.svg" className='svg-white w-6' alt="arrow" />
          </button>
        </div>
        <div className="w-4/12">
          <button className="w-full btn-info flex justify-between items-center">Add New<img src="/icons/plus.svg" className='svg-white w-6' alt="plus" /></button>
        </div>
      </div>

      {/* Show captain  */}
      <CaptainCard teamData={teamData} />

      <div className="bulk-operations-players mt-8">
        <p>Make Inactive / Re-rank / A-Z</p>
        <PlayerList eventId='random' playerList={teamData ? teamData.players : []} />
      </div>
    </div>
  )
}

export default TeamSingle;