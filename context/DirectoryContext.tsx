'use client';

import React, { useContext } from 'react';
import { createContext, useState } from 'react';

interface DirectoryContextType {
	workingDir: string;
	setWorkingDir: (dir: string) => void
}

const DirectoryContext = createContext<DirectoryContextType | undefined> (undefined);

export const DirectoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [ workingDir, setWorkingDir ] = useState<string>('/');
	return (
		<DirectoryContext.Provider value={{ workingDir, setWorkingDir }}>
			{children}
		</DirectoryContext.Provider>
	)
}

export const useDirectory = () => {
	const context = useContext(DirectoryContext);
	if(!context) throw new Error('useDirectory must be under a DirectoryContextProvider');
	return context;
}