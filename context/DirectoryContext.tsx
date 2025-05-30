'use client';
import React, { useState, createContext, useContext } from 'react';

interface DirectoryContextType {
	refreshKey: number,
	incrementRefreshKey: () => void,

}

const DirectoryContext = createContext<DirectoryContextType | undefined> (undefined);
export const DirectoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [ refreshKey, setRefreshKey ] = useState<number>(0);
	const incrementRefreshKey = () => { setRefreshKey(refreshKey+1) }

	return (
		<DirectoryContext.Provider value={{ refreshKey, incrementRefreshKey }}>
			{children}
		</DirectoryContext.Provider>
	)
}

export const useDirectory = () => {
	const context = useContext(DirectoryContext);
	if(!context) throw new Error('useDirectory must be under a DirectoryContextProvider');
	return context;
}