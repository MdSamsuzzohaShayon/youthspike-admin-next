'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie } from '@/utils/cookie';
import { IUser } from '@/types/user';

interface IUserContext {
    token: string | null;
    info: IUser | null;
}

export const UserContext = createContext<IUserContext>({ token: null, info: null });



function UserProvider({ children }: React.PropsWithChildren) {
    const [token, setToken] = useState<string | null>(null);
    const [info, setInfo] = useState<IUser | null>(null);

    useEffect(() => {
        const findToken = getCookie('token');
        const findUser = getCookie('user');
        if (findToken && findToken !== '' && findToken !== null) setToken(findToken);
        if (findUser && findToken !== '' && findToken !== null) setInfo(JSON.parse(findUser));
    }, []);
    return (
        <UserContext.Provider value={{ info, token }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}

export default UserProvider;


