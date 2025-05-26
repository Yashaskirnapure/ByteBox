'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useDirectory } from '@/context/DirectoryContext';
import { columns } from './Columns';
import { FileData } from '@/types/types';
import { DataTable } from './DataTable';

interface FileListProps {
	displayFiles: Array<FileData>,
	selectedFiles: Array<FileData>,
	setSelectedFiles: (files: Array<FileData>) => void,
	isLoading: boolean,
	isLoadingError: boolean,
	loadingError: string | null,
}

const FileList: React.FC<FileListProps> = ({ displayFiles, selectedFiles, setSelectedFiles, isLoading, isLoadingError, loadingError}) => {
	const { workingDir, setWorkingDir, refreshKey, incrementRefreshKey } = useDirectory();
	const { isLoaded, isSignedIn, user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if(isLoaded && !isSignedIn) router.push('/sign-in');
	}, [isLoaded, isSignedIn, router]);

	if(!isLoaded) return <h1>Loading....please wait</h1>
	if(!isSignedIn) return null;

	return (
		<div className="w-full h-full p-3 bg-gray-100">
			{isLoading ? (
				<div className="text-muted-foreground">Loading files...</div>
			) : isLoadingError ? (
				<div className="text-red-500">{loadingError}</div>
			) : displayFiles.length === 0 ? (
				<div className="text-muted-foreground">Nothing to show here</div>
			) : ( <DataTable<FileData, unknown> columns={columns} data={displayFiles} setSelectedFiles={setSelectedFiles}/> )}
		</div>
	);
};

export default FileList;
