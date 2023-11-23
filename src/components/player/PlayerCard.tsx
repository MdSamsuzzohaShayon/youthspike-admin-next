import { IPlayer } from '@/types/player';
import React from 'react';

interface PlayerCardProps {
  player: IPlayer
}

function PlayerCard({ player }: PlayerCardProps) {
  return (
    <li className='w-full bg-gray-700 py-2 flex justify-between items-center gap-1' style={{minHeight: '6rem'}}>
      <input type="checkbox" name="player-select" id="option" className='w-1/12' />

      <div className="img-wrapper h-full w-4/12 flex justify-between items-center gap-1">
        <img src="/free-logo.svg" alt="" className="w-10 h-10 border-4 border-yellow-500 rounded-full" />
        <div className="player-name flex flex-col w-full">
          <h3>{player.firstName + ' ' + player.lastName}</h3>
          <p className='text-yellow-500 uppercase'>Captain</p>
        </div>
      </div>

      <div className="rank-box h-10 w-1/12 flex flex-col">
        <h3 className='bg-yellow-500 w-8 h-8 flex justify-center items-center'>{player.rank}</h3>
        <p>Rank</p>
      </div>

      <div className="text-box w-5/12">
        <div className="w-full">
          <p className='break-words' >7676-783-8263</p>
          <p className='break-words' >mdsamsuzzoha5222@gmail.com</p>
          <p className='break-words' >2-3 / +3 games</p>
        </div>
      </div>

      <img src="/icons/dots-vertical.svg" alt="dot-vertical" className='w-1/12 svg-white' />
    </li>
  )
}

export default PlayerCard;