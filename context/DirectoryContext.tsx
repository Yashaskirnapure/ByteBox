'use client';

import React, { useState, createContext, useContext } from 'react';

interface DirectoryContextType {
	id: string | null,
	setId: (id: string) => void
	workingDir: string,
	setWorkingDir: (dir: string) => void,
	refreshKey: number,
	incrementRefreshKey: () => void,
}

const DirectoryContext = createContext<DirectoryContextType | undefined> (undefined);

export const DirectoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [ workingDir, setWorkingDir ] = useState<string>('/');
	const [ refreshKey, setRefreshKey ] = useState<number>(0);
	const incrementRefreshKey = () => { setRefreshKey(refreshKey+1) }
	const [ id, setId ] = useState<string | null>(null);

	return (
		<DirectoryContext.Provider value={{ id, setId, workingDir, setWorkingDir, refreshKey, incrementRefreshKey }}>
			{children}
		</DirectoryContext.Provider>
	)
}

export const useDirectory = () => {
	const context = useContext(DirectoryContext);
	if(!context) throw new Error('useDirectory must be under a DirectoryContextProvider');
	return context;
}