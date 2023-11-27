import React from 'react';
import TeamCard from './TeamCard';
import { ITeam } from '@/types';

interface TeamListProps{
    teamList: ITeam[],
}

function TeamList({teamList}: TeamListProps) {
    return (
        <div className="team-list flex flex-col justify-between items-center gap-3">
            {teamList.map((team)=> <TeamCard key={team._id} team={team} /> )}
        </div>
    )
}

export default TeamList;