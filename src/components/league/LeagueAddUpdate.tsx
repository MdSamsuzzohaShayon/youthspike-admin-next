import { ADD_UPDATE_LEAGUE, ADD_UPDATE_LEAGUE_RAW } from '@/graphql/league';
import { useMutation } from '@apollo/client';
import React, { useState, useEffect, useRef } from 'react';
import ToggleInput from '../elements/forms/ToggleInput';
import SelectInput from '../elements/forms/SelectInput';
import TextInput from '../elements/forms/TextInput';
import { ILeagueAddProps, ILeagueAdd, IOption } from '@/types';
import NumberInput from '../elements/forms/NumberInput';
import { getCookie } from '@/utils/cookie';
import { BACKEND_URL } from '@/utils/keys';
import { useRouter } from 'next/navigation';


const homeTeamStrategyList: IOption[] = [{ value: 'toss', text: "Toss" }];
const rosterLockList: IOption[] = [{ value: 'first', text: 'First roster submit' }];
const assignLogicList: IOption[] = [{ value: 'hight' }, { value: 'random' }];

const initialLeague = {
    name: 'N-2',
    // startDate, endDate, playerLimit
    divisions: '',
    nets: 3,
    rounds: 4,
    netVariance: 3,
    homeTeam: homeTeamStrategyList[0].value,
    autoAssign: false,
    autoAssignLogic: assignLogicList[1].value,
    rosterLock: rosterLockList[0].value,
    timeout: 3,
    passcode: '0913',
    coachPassword: 'Spikeball',
    location: 'USA',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    // directorId: new Date().toISOString(),
    playerLimit: 10,
    active: true
}

function LeagueAddUpdate({ update, setActErr }: ILeagueAddProps) {

    const router = useRouter();

    const sponsorInputEl = useRef<HTMLInputElement>(null);
    const [leagueState, setLeagueState] = useState<ILeagueAdd>(initialLeague);
    const [sponsorImgList, setSponsorImgList] = useState<File[]>([]);

    const [addLeague, { error, loading, data }] = useMutation(ADD_UPDATE_LEAGUE);

    /**
     * Add league mutation
     */
    const handleLeagueAdd = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        let newLeagueId = null;
        const inputData = { ...leagueState, directorId: 'abc' };
        const mutationVariables = {
            sponsors: sponsorImgList.length > 0 ? null : [],
            input: inputData,
        };

        try {
            if (sponsorImgList.length > 0) {
                // Use FormData with fetch if there is a file to upload on the server
                const formData = new FormData();
                formData.set('operations', JSON.stringify({
                    query: ADD_UPDATE_LEAGUE_RAW,
                    variables: mutationVariables,
                }));
                formData.set('map', JSON.stringify({ '0': ['variables.sponsors'] }));

                // Append sponsors to the FormData
                sponsorImgList.forEach((file, index) => {
                    formData.set(index.toString(), file);
                });

                const token = getCookie('token');
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const responseData = await response.json();

                if (responseData?.data?.createOrUpdateLeague?.code !== 201) {
                    setActErr({
                        name: responseData?.data?.createOrUpdateLeague?.code,
                        message: responseData?.data?.createOrUpdateLeague?.message,
                        main: responseData.data,
                    });
                } else {
                    newLeagueId = responseData?.data?.createOrUpdateLeague?.data?._id;
                }
            } else {
                // Use Apollo Client mutation
                const { data: leagueData } = await addLeague({ variables: mutationVariables });
                if(leagueData.createOrUpdateLeague.code !== 201){
                    setActErr({name: leagueData.createOrUpdateLeague.code, message: leagueData.createOrUpdateLeague.message})
                }else{
                    newLeagueId = leagueData.createOrUpdateLeague.data._id
                }
                
            }

            // Reset form and navigate
            setLeagueState(initialLeague);
            const formEl = e.target as HTMLFormElement;
            formEl.reset();

            if (newLeagueId) router.push(`/${newLeagueId}`);
        } catch (error) {
            // @ts-ignore
            setActErr({ name: 'Invalid Mutation', message: error.message || '', main: error });
        }
    };

    /**
     * Change input on cange event
     */
    const handleInputChange = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const inputEl = e.target as HTMLInputElement;
        setLeagueState((prevState) => (
            {
                ...prevState,
                [inputEl.name]: inputEl.value
            }
        ));
    }

    const handleToggleInput = (e: React.SyntheticEvent, stateName: string) => {
        e.preventDefault();
        // @ts-ignore
        const prevStateVal: boolean = leagueState[stateName];
        setLeagueState((prevState) => (
            {
                ...prevState,
                [stateName]: !prevStateVal
            }
        ));
    }

    const handleImgRemove = (e: React.SyntheticEvent, imgName: string) => {
        e.preventDefault();
        setSponsorImgList((prevState) => {
            return prevState.filter((imgFile) => imgFile.name !== imgName);
        });
    }

    /**
     * File Upload
     */
    const handleOpenImg = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!sponsorInputEl.current) return;
        sponsorInputEl.current.click();
    }

    const handleFileChange = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const fileInputEl = e.target as HTMLInputElement;
        if (fileInputEl.files && fileInputEl.files.length > 0) {
            // @ts-ignore
            setSponsorImgList((prevState) => ([...prevState, fileInputEl.files[0]]));
        }
    }

    /**
     * Renders
     */
    const renderDivisions = (dStr: string) => {
        if (!dStr.includes(',')) return <ul>{dStr}</ul>;
        const dList: string[] = dStr.split(',');
        const listEl: React.ReactNode[] = [];
        for (let i = 0; i < dList.length; i += 1) {
            if (dList[i].trim() !== '') {
                listEl.push(<li className='px-4 py-2 rounded-full bg-gray-800 flex items-center justify-between' key={dList[i] + '-' + i}>{dList[i]}</li>);
            }
        }
        return <ul className='flex gap-1'>{listEl}</ul>
    }

    const displaySponsorImg = (fileList: File[]) => {
        const imgElList: React.ReactNode[] = []
        for (let i = 0; i < fileList.length; i += 1) {
            const imgEl = (
                <li className='relative' key={i}>
                    <img
                        src={URL.createObjectURL(fileList[i])}
                        alt={`Sponsor ${i + 1}`}
                        className="w-20 static"
                        key={fileList[i].name + '' + i}
                    />
                    <img src='/icons/close.svg' className='absolute top-1 right-1 w-6 h-6 rounded-full svg-white'
                        role="presentation"
                        onClick={e => handleImgRemove(e, fileList[i].name)}
                    />
                </li>
            );
            imgElList.push(imgEl);
        }

        return (<ul className="show-sponsors flex justify-between w-full items-center flex-wrap">{imgElList}</ul>);
    }

    return (
        <form onSubmit={handleLeagueAdd} className='flex flex-col gap-2'>
            <TextInput required={!update} defaultValue={leagueState.divisions} handleInputChange={handleInputChange} lblTxt='DIVISIONS' name='divisions' lw='w-2/6' rw='w-4/6' />
            {renderDivisions(leagueState.divisions)}
            {/* Default setting  */}
            <h3 className='text-2xl capitalize mt-4'>Default setting</h3>

            <NumberInput defaultValue={leagueState.nets} handleInputChange={handleInputChange} lblTxt='Number of nets' name='nets' required={!update} />
            <NumberInput defaultValue={leagueState.rounds} handleInputChange={handleInputChange} lblTxt='Number of rounds' name='rounds' required={!update} />
            <NumberInput defaultValue={leagueState.netVariance} handleInputChange={handleInputChange} lblTxt='Net Variance' name='netVariance' required={!update} />

            <SelectInput name='homeTeam' defaultValue={leagueState.homeTeam} optionList={homeTeamStrategyList} lblTxt='How is home team decided?' handleSelect={handleInputChange} />
            <ToggleInput handleValueChange={handleToggleInput} lblTxt='Auto assign when clock runs out' value={leagueState.autoAssign}
                name="autoAssign" />
            <SelectInput defaultValue={leagueState.autoAssignLogic} name='autoAssignLogic' optionList={assignLogicList} lblTxt='Which auto assign logic when clock runs out?' handleSelect={handleInputChange} rw='w-3/6' lw='w-3/6' />
            <SelectInput name='rosterLock' defaultValue={rosterLockList[0].value} optionList={rosterLockList} lblTxt='When does the roster lock setting?' handleSelect={handleInputChange} rw='w-3/6' lw='w-3/6' />
            {/* 
            <div className="input-group w-full flex flex-col">
                <label htmlFor="name">Name</label>
                <input className='border border-gray-300 p-1' type="text" defaultValue={name} required={!update} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="startDate">Start</label>
                <input className='border border-gray-300 p-1' type="datetime-local" defaultValue={startDate} required={!update} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="endDate">End</label>
                <input className='border border-gray-300 p-1' type="datetime-local" defaultValue={endDate} required={!update} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="input-group w-full flex flex-col">
                <label htmlFor="playerLimit">Player Limit</label>
                <input className='border border-gray-300 p-1' type="number" required={!update} onChange={(e) => setPlayerLimit(parseInt(e.target.value, 10))} />
            </div>
            <div className="input-group w-full">
                <button className='border border-gray-300 bg-gray-900 text-gray-300 p-2' type='submit'>Create</button>
            </div> */}
            <div className="sponsors-heading flex justify-between w-full mt-4 items-center">
                <h3 className='text-2xl capitalize'>Sponsors</h3>
                <button type="button" onClick={handleOpenImg} className="w-fit rounded-full p-2 px-8 outline-none bg-yellow-500 text-gray-100 mt-4 font-bold transform transition duration-300">Add New</button>
                <input type="file" name="sponsor" id="sponsor" className='hidden' ref={sponsorInputEl} onChange={handleFileChange} />
            </div>
            {displaySponsorImg(sponsorImgList)}
            <button
                className="rounded p-2 px-8 outline-none bg-gray-900 hover:bg-gray-500 text-gray-100 mt-4 font-bold transform transition duration-300 hover:scale-110"
                type="submit"
            >
                Submit
            </button>
        </form>
    )
}

export default LeagueAddUpdate;