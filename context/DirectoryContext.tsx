'use client';

import { FileData } from '@/components/FileTable/Columns';
import React, { useState, createContext, useContext } from 'react';

interface FolderData{
	id: string | null,
	name: string,
	parentId: string | null,
};

interface DirectoryContextType {
	//currunt working directory ----> object containing its Id, name, and Parent Id
	workingDir: FolderData,
	setWorkingDir: (dir: FolderData) => void,

	//keep track of changes being made in the folder --> creation/deletion ----> fetch details again
	refreshKey: number,
	incrementRefreshKey: () => void,

	//keep track of selected files and folders in the directory
	selectedFiles: FileData[],
	setSelectedFiles: (files: FileData[]) => void,
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
	const [ selectedFiles, setSelectedFiles ] = useState<FileData[]>([]);

	return (
		<DirectoryContext.Provider value={{
			workingDir, setWorkingDir,
			refreshKey, incrementRefreshKey,
			selectedFiles, setSelectedFiles,
		}}>
			{children}
		</DirectoryContext.Provider>
	)
}

export const useDirectory = () => {
	const context = useContext(DirectoryContext);
	if(!context) throw new Error('useDirectory must be under a DirectoryContextProvider');
	return context;
}