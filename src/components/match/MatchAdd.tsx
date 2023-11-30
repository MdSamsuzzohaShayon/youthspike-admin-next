import { GET_EVENT_WITH_TEAMS } from '@/graphql/teams';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import DateInput from '../elements/forms/DateInput';
import { IAddMatch, IOption, ITeam } from '@/types';
import TextInput from '../elements/forms/TextInput';
import NumberInput from '../elements/forms/NumberInput';
import SelectInput from '../elements/forms/SelectInput';

const initialAddMatch = {
    date: new Date(),
    event: "",
    location: "",
    netRange: 5,
    numberOfNets: 3,
    numberOfRounds: 2,
    pairLimit: 5,
    teamA: "",
    teamB: ""
}
function MatchAdd({ eventId }: { eventId: string }) {
    const [fetchEventWithTeams, { data, error, loading }] = useLazyQuery(GET_EVENT_WITH_TEAMS, { variables: { eventId } }); // Get event details
    const [addMatch, setAddMatch] = useState<IAddMatch>(initialAddMatch);
    const [teams, setTeams] = useState<ITeam[]>([]);

    const handleInputChange = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const inputEl = e.target as HTMLInputElement;
        setAddMatch((prevState) => ({ ...prevState, [inputEl.name]: inputEl.value }));
    }

    const handleSelectChange = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const inputEl = e.target as HTMLSelectElement;
        setAddMatch((prevState) => ({ ...prevState, [inputEl.name]: inputEl.value }));
    }

    const handleAddMatch = (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(addMatch);
    }

    useEffect(() => {
        (async () => {
            const eventRes = await fetchEventWithTeams();            
            if (eventRes.data) {
                // Set all default values from here
                // @ts-ignore
                const fetchedTeams = eventRes?.data?.getEvent?.data?.teams;                
                if (fetchedTeams) setTeams(fetchedTeams);

            }
        })()
    }, []);

    const showTeamList = (teamItems: ITeam[]): IOption[] => {
        if (!teamItems) return [];
        const options = [];
        for (let i = 0; i < teamItems.length; i++) {
            options.push({ value: teamItems[i]._id, text: teamItems[i].name });
        }
        return options;
    }

    return (
        <form onSubmit={handleAddMatch}>
            <DateInput handleInputChange={handleInputChange} name='date' required defaultValue={addMatch.date} vertical />
            <TextInput handleInputChange={handleInputChange} name='location' required defaultValue={addMatch.location} vertical />
            <NumberInput required lblTxt='Net Range' name='netRange' defaultValue={addMatch.netRange} handleInputChange={handleInputChange} vertical />
            <NumberInput required lblTxt='Number of nets' name='numberOfNets' defaultValue={addMatch.numberOfNets} handleInputChange={handleInputChange} vertical />
            <NumberInput required lblTxt='Number of rounds' name='numberOfRounds' defaultValue={addMatch.numberOfRounds} handleInputChange={handleInputChange} vertical />
            <NumberInput required lblTxt='pair Limit' name='pairLimit' defaultValue={addMatch.pairLimit} handleInputChange={handleInputChange} vertical />
            <SelectInput name='teamA' optionList={showTeamList(teams)} handleSelect={handleSelectChange} defaultValue={addMatch.teamA} vertical />
            <SelectInput name='teamB' optionList={showTeamList(teams)} handleSelect={handleSelectChange} defaultValue={addMatch.teamB} vertical />
            <button className="btn-secondary mt-4">Add Match</button>
        </form>
    )
}

export default MatchAdd;