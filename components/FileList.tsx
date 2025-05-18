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

interface FileInfo {
	name: string,
	location: string,
	type: "folder" | "file",
	owner: string,
	last_modified: Date,
	size: number
};

const FileList = () => {
	const [ files, setFiles ] = useState<Array<FileInfo>>([]);
	const [ isLoadingError, setIsLoadingError ] = useState<boolean>(false);
	const [ loadingError, setLoadingError ] = useState<string | null>(null);
	const { isLoaded, isSignedIn, user } = useUser();

	const { id, setId, workingDir, setWorkingDir, refreshKey, incrementRefreshKey } = useDirectory();
	const router = useRouter();

	useEffect(() => {
		if(isLoaded && !isSignedIn) router.push('/sign-in');
	}, [isLoaded, isSignedIn, router]);

	useEffect(() => {
		const fetchFiles = async () => {
			try{
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
			}
		}
		//fetchFiles();
	}, [isLoaded, isSignedIn, workingDir, user, refreshKey]);

	if(!isLoaded) return <h1>Loading....please wait</h1>
	if(!isSignedIn) return null;

	return (
		<div className="w-full h-full p-3 bg-gray-100">
			{files.length === 0 ? (
				<div className="text-muted-foreground">Nothing to show here</div>
			) : isLoadingError ? (
				<div className="text-red-500">{loadingError}</div>
			) : (
				<Card className="overflow-hidden bg-gray-100">
					<CardContent className="p-0 divide-y">
						<div className="grid grid-cols-6 text-sm text-muted-foreground px-4 pb-2">
							<span className="col-span-2">File name</span>
							<span>Location</span>
							<span>Owner</span>
							<span>Last modified</span>
							<span className="text-right">File size</span>
						</div>
						{files.map((file, i) => (
							<div
								key={i}
								className="grid grid-cols-6 items-center px-4 py-3 text-xs hover:bg-muted transition cursor-pointer text-muted-foreground"
							>
								<div className="col-span-2 flex items-center gap-2">
									{file.type === 'folder' ? (
										<Folder className="w-4 h-4 text-yellow-500" />
									) : (
										<File className="w-4 h-4 text-gray-500" />
									)}
									<span className="truncate">{file.name}</span>
								</div>
								<span className="truncate">{file.location}</span>
								<div className="flex items-center gap-2">
									<span>{file.owner}</span>
								</div>
								<span>{file.last_modified.toLocaleString()}</span>
								<span className="text-right">{file.size}</span>
							</div>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);

};

export default FileList;
