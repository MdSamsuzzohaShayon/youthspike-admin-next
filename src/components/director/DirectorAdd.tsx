import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_DIRECTOR } from '@/graphql/admin';
import Loader from '../elements/Loader';
import { getCookie } from '@/utils/cookie';

function DirectorAdd() {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorList, setErrorList] = useState<string[]>([]);

  const [registerDirector, {data, error, loading}] = useMutation(REGISTER_DIRECTOR);


    const handleDirectorSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (password !== confirmPassword){
            setErrorList(['Password did not match!']);
            return;
        }
        
        const {data: resultData} = await registerDirector({variables: {firstName, lastName, email, password}});
        console.log(resultData);
        console.log(error);
        
        

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        const formEl = e.target as HTMLFormElement;
        formEl.reset();
    }

    if(loading) return <Loader />;
    // if(error) ;

    return (
        <div>
            <h2>Add Director</h2>
            {errorList.map(e=> <p className='mt-4 text-red-700' key={e}>{e}</p>)}
            <form onSubmit={handleDirectorSubmit} className='flex flex-col gap-2'>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="firstName">First Name </label>
                    <input className='border border-gray-300 p-1' type="text" defaultValue={firstName} required onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="lastName">Last Name </label>
                    <input className='border border-gray-300 p-1' type="text" defaultValue={lastName} required onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="email">Email </label>
                    <input className='border border-gray-300 p-1' type="email" defaultValue={email} required onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="password">Password </label>
                    <input className='border border-gray-300 p-1' type="password" defaultValue={password} required onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="confirmPassword">Confirm Password </label>
                    <input className='border border-gray-300 p-1' type="password" defaultValue={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="input-group w-full">
                    <button className='border border-gray-300 bg-gray-900 text-gray-300 p-2' type='submit'>Register</button>
                </div>
            </form>
        </div>
    )
}

export default DirectorAdd