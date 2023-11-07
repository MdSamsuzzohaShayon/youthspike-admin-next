import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER_DIRECTOR } from '@/graphql/admin';
import Loader from '../elements/Loader';

interface DirectorAddProps { }

/**
 * React component that allows users to add a director.
 */
const DirectorAdd: React.FC<DirectorAddProps> = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorList, setErrorList] = useState<string[]>([]);

    const [registerDirector, { loading, error }] = useMutation(REGISTER_DIRECTOR);

    /**
     * Handles the form submission event.
     * Validates the form input values and calls the registration mutation if they pass validation.
     * Resets the form input values and clears the form.
     */
    const handleDirectorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorList(['Password did not match!']);
            return;
        }

        // try {
        //     const { data } = await registerDirector({
        //         variables: { firstName, lastName, email, password },
        //     });
        //     console.log(data);
        // } catch (error) {
        //     console.log(error);
        // }

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        const formEl = e.target as HTMLFormElement;
        formEl.reset();
    };

    if (loading) return <Loader />;
    if (error) return <p className="text-red-700">Something went wrong!</p>;

    return (
        <div>
            <h2>Add Director</h2>
            {errorList.map((error) => (
                <p className="mt-4 text-red-700" key={error}>
                    {error}
                </p>
            ))}
            <form onSubmit={handleDirectorSubmit} className="flex flex-col gap-2">
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        id='firstName'
                        className="border border-gray-300 text-gray-900 p-1"
                        type="text"
                        required
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        id='lastName'
                        className="border border-gray-300 text-gray-900 p-1"
                        type="text"
                        required
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input
                        id='email'
                        className="border border-gray-300 text-gray-900 p-1"
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input
                        id='password'
                        className="border border-gray-300 text-gray-900 p-1"
                        type="password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-group w-full flex flex-col">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        id='confirmPassword'
                        className="border border-gray-300 text-gray-900 p-1"
                        type="password"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="input-group w-full">
                    <button className="border border-gray-300 text-gray-100 bg-gray-900 text-gray-300 p-2" type="submit">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};


export default DirectorAdd;