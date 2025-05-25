'use client';

import React, { useState, createContext, useContext } from 'react';
import { FolderData } from '@/types/types';

interface DirectoryContextType {
	workingDir: FolderData,
	setWorkingDir: (dir: FolderData) => void,

	refreshKey: number,
	incrementRefreshKey: () => void,
}

const DirectoryContext = createContext<DirectoryContextType | undefined> (undefined);

export const DirectoryContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const rootFolder = {
		id: null,
		name: "/",
		parentId: null
	};

	const [ workingDir, setWorkingDir ] = useState<FolderData>(rootFolder);
	const [ refreshKey, setRefreshKey ] = useState<number>(0);
	const incrementRefreshKey = () => { setRefreshKey(refreshKey+1) }

	return (
		<DirectoryContext.Provider value={{ workingDir, setWorkingDir, refreshKey, incrementRefreshKey }}>
			{children}
		</DirectoryContext.Provider>
	)
}

export const useDirectory = () => {
	const context = useContext(DirectoryContext);
	if(!context) throw new Error('useDirectory must be under a DirectoryContextProvider');
	return context;
}