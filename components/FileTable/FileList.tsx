'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useDirectory } from '@/context/DirectoryContext';
import { FileData, columns } from './Columns';
import { DataTable } from './DataTable';

const FileList = () => {
	const [ files, setFiles ] = useState<Array<FileData>>([]);
	const [ isLoadingError, setIsLoadingError ] = useState<boolean>(false);
	const [ loadingError, setLoadingError ] = useState<string | null>(null);
	const { isLoaded, isSignedIn, user } = useUser();
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { workingDir, setWorkingDir, refreshKey, incrementRefreshKey } = useDirectory();
	const router = useRouter();

	useEffect(() => {
		if(isLoaded && !isSignedIn) router.push('/sign-in');
	}, [isLoaded, isSignedIn, router]);

	useEffect(() => {
		const fetchFiles = async () => {
			try{
				setIsLoading(true);
				if (!isLoaded || !isSignedIn || !user?.id) return;
				const userId = user.id;
				const parentId = workingDir.id === null ? '' : workingDir.id;

				const response = await fetch(`http://localhost:3000/api/file?userId=${encodeURIComponent(userId)}&workingDir=${encodeURIComponent(parentId)}`);
				if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				const body = await response.json();
				const content = body.content;
				console.log(content)
				const normalized: FileData[] = content.map((item: any) => {
					return {
						id: item.id,
						name: item.name,
						type: item.isFolder === true ? "folder" : "file",
						size: item.size,
						createdAt: new Date(item.createdAt),
						updatedAt: new Date(item.updatedAt),
					}
				});
				setFiles(normalized);
			}catch(err){
				setIsLoadingError(true);
				setLoadingError("Could not load files");
				console.error("Error loading files", err);
			}finally{
				setIsLoading(false);
			}
		}
		fetchFiles();
	}, [isLoaded, isSignedIn, workingDir, user, refreshKey]);

	if(!isLoaded) return <h1>Loading....please wait</h1>
	if(!isSignedIn) return null;

	return (
		<div className="w-full h-full p-3 bg-gray-100">
			{isLoading ? (
				<div className="text-muted-foreground">Loading files...</div>
			) : isLoadingError ? (
				<div className="text-red-500">{loadingError}</div>
			) : files.length === 0 ? (
				<div className="text-muted-foreground">Nothing to show here</div>
			) : ( <DataTable columns={columns} data={files}/> )}
		</div>
	);
};

export default FileList;
