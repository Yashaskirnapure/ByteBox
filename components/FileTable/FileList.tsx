'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Folder, File } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useDirectory } from '@/context/DirectoryContext';
import { FileData, columns } from './Columns';
import { DataTable } from './DataTable';

const FileList = () => {
	const [ files, setFiles ] = useState<Array<FileData>>([]);
	const [ isLoadingError, setIsLoadingError ] = useState<boolean>(false);
	const [ loadingError, setLoadingError ] = useState<string | null>(null);
	const { isLoaded, isSignedIn, user } = useUser();
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const { id, setId, workingDir, setWorkingDir, refreshKey, incrementRefreshKey } = useDirectory();
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
				const parentId = id ? id : '';

				const response = await fetch(`http://localhost:3000/api/file?userId=${encodeURIComponent(userId)}&workingDir=${encodeURIComponent(parentId)}`);
				if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				const body = await response.json();
				const content = body.content
				setFiles(content);
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
