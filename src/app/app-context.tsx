'use client'
import { IUser } from '@/shared/types/user';
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

interface AppContextType {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<null>>;
}
const AppContext = createContext<AppContextType>({
    user: null,
    setUser: () => {}
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
