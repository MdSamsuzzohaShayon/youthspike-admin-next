import React, { useState } from 'react'
import TextInput from '../elements/forms/TextInput';
import { IPlayerAdd } from '@/types/player';
import NumberInput from '../elements/forms/NumberInput';
import SelectInput from '../elements/forms/SelectInput';
import { IOption } from '@/types';
import { useMutation } from '@apollo/client';
import { CREATE_PLAYER } from '@/graphql/players';

const initialPlayerAdd = {
  firstName: '',
  lastName: '',
  event: '',
  team: '',
  rank: null
};
const eventOption: IOption[] = [{ text: 'Team 1', value: 't1' }, { text: 'Team 2', value: 't2' }];

function PlayerAdd({eventId}: {eventId: string}) {
  const [playerAdd, setPlayerAdd] = useState<IPlayerAdd>(initialPlayerAdd);
  const [addPlayer, { data }] = useMutation(CREATE_PLAYER)


  const handleAddPlayer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const playerAddObj = structuredClone(playerAdd);
    playerAddObj.event = eventId;
    const playerRes = await addPlayer({ variables: { input: playerAddObj } });
    console.log(playerRes);
    
  }

  const handleInputChange = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const inputEl = e.target as HTMLInputElement;
    setPlayerAdd(prevState => ({ ...prevState, [inputEl.name]: inputEl.value }));
  }

  const handleSelect = (e: React.SyntheticEvent) => { }


  return (
    <div>
      <form onSubmit={handleAddPlayer}>
        <TextInput name='firstName' lblTxt='First Name' defaultValue={playerAdd.firstName} handleInputChange={handleInputChange} required vertical />
        <TextInput name='lastName' lblTxt='Last Name' defaultValue={playerAdd.lastName} handleInputChange={handleInputChange} required vertical />
        <NumberInput name='rank' defaultValue={playerAdd.rank} handleInputChange={handleInputChange} lw="w-full" rw="w-full" required vertical />
        <SelectInput name='team' optionList={eventOption} handleSelect={handleSelect} lw="w-full" rw="w-full" vertical />
        <button type="submit" className='btn-secondary'>Submit</button>
      </form>
    </div>
  )
}

export default PlayerAdd