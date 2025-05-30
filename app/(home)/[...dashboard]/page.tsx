'use client';

import React from 'react';
import { SideBar } from '@/components/SideBar';
import Topbar from '@/components/Topbar';
import { Separator } from '@/components/ui/separator';
import FileList from '@/components/FileTable/FileList';
import { useState, useEffect } from 'react';
import { FileData } from '@/types/types';
import { useUser } from '@clerk/nextjs';
import { useDirectory } from '@/context/DirectoryContext';
import { NextResponse } from 'next/server';
import { toast } from "sonner";
import { useDirectoryNavigation } from '@/context/DirectoryNavigationContext';

const Home = () => {
	const { refreshKey, incrementRefreshKey } = useDirectory();
	const { workingDir, setWorkingDir, moveUp } = useDirectoryNavigation();
	const { isLoaded, isSignedIn, user } = useUser();

	const [ selectedFiles, setSelectedFiles ] = useState<Array<FileData>>([]);
	const [ displayFiles, setDisplayFiles ] = useState<Array<FileData>>([]);
	const [ files, setFiles ] = useState<Array<FileData>>([]);

	const [ isLoadingError, setIsLoadingError ] = useState<boolean>(false);
	const [ loadingError, setLoadingError ] = useState<string | null>(null);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);

	const [ fileError, setFileError ] = useState<boolean>(false);
	const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
	const [ newFolderName, setNewFolderName ] = useState<string>("");
	const [ uploading, setUploading ] = useState<boolean>(false);
	const [ creating, setCreating ] = useState<boolean>(false);
	const [ deleting, setDeleting ] = useState<boolean>(false);
	const [ starring, setStarring ] = useState<boolean>(false);
	const [ dialogOpen, setDialogOpen ] =  useState<boolean>(false);
	const [ searchQuery, setSearchQuery ] = useState<string>('');
	const [ clicked, setClicked ] = useState<boolean>(false);

	useEffect(() => {
		const searchResults = files.filter((file) => { return file.name.toLowerCase().includes(searchQuery); });
		setDisplayFiles(searchResults);
	}, [ searchQuery ]);

	useEffect(() => {
		const fetchFiles = async () => {
			try{
				setIsLoading(true);
				if (!isLoaded || !isSignedIn || !user?.id) return;
				const userId = user.id;
				const workingDirParam = workingDir.id ?? '';

				const response = await fetch(
					`http://localhost:3000/api/file?userId=${encodeURIComponent(userId)}&workingDir=${encodeURIComponent(workingDirParam)}`
				);
				if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				const body = await response.json();
				const content = body.content;
				console.log(content);
				const normalized: FileData[] = content.map((item: any) => {
					return {
						id: item.id,
						name: item.name,
						type: item.isFolder === true ? "folder" : "file",
						size: item.size,
						createdAt: new Date(item.createdAt),
						updatedAt: new Date(item.updatedAt),
						fileUrl: item.fileUrl,
						parentId: item.parentID
					}
				});
				setFiles(normalized);
				setDisplayFiles(normalized);
			}catch(err){
				setIsLoadingError(true);
				toast.error("Could not load files");
				console.error("Error loading files", err);
			}finally{
				setIsLoading(false);
			}
		}
		fetchFiles();
	}, [isLoaded, isSignedIn, workingDir, user, refreshKey]);

	const handleStar = async() => {
		setFileError(false);
		setErrorMessage(null);
		setClicked(true);
		setStarring(true);

		try{
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const userId = user.id;
			const fileIds = selectedFiles.map(file => file.id);
			const response = await fetch(
				`http://localhost:3000/api/file/star?userId=${userId}`,
				{
					method: "PATCH",
					body: JSON.stringify({ fileIds }),
				}
			);

			if(!response.ok) throw new Error("Could not star files.");
		}catch(err: any){
			setFileError(true);
			toast.error("Could not add files to favourites.");
		}finally{
			setClicked(false);
			setStarring(false);
		}
	}

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setFileError(false);
		setErrorMessage(null);

		try{
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const files = event.target.files;
			if(!files || files.length === 0){
				setFileError(true);
				toast.error("Please upload file");
				return;
			}

			setUploading(true);

			const userId = user.id;
			const workingDirParam = workingDir.id ?? '';

			const file = files[0];
			const formData = new FormData();
			formData.append('file', file);
			formData.append('userId', userId);
			if(workingDirParam) formData.append('parentId', workingDirParam);

			const response = await fetch(
				`http://localhost:3000/api/file/upload`,
				{
					method: 'POST',
					body: formData,
				}
			);
			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
			incrementRefreshKey();
		}catch(err: any){
			toast.error('Could not upload file.');
			setFileError(true);
		}finally{
			setUploading(false);
		}
	}

	const handleCreateFolder = async() => {
		setDialogOpen(false);
		setErrorMessage(null);
		setFileError(false);
		setCreating(true);

		try{
			if(!isLoaded || !isSignedIn || !user?.id) return;

			const userId = user.id;
			if(!newFolderName || newFolderName.trim().length === 0){
				setFileError(true);
				setErrorMessage("Please provide name for creating folder.");
				return;
			}

			const response = await fetch(
				'http://localhost:3000/api/folder',
				{
					method: 'POST',
					body: JSON.stringify({
						name: newFolderName,
						userId: userId,
						parentID: workingDir,
					})
				}
			);

			if(!response.ok) throw new Error("Could not create folder.");
			incrementRefreshKey();
		}catch(err: any){
			console.log(err);
			toast.error('Could not create folder');
			setFileError(true);
		}finally{
			setCreating(false);
		}
	}

	const handleDelete = async() => {
		setFileError(false);
		setErrorMessage(null);
		setClicked(true);
		try{
			setDeleting(true);
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const userId = user.id;

			const fileIds = selectedFiles.map(file => file.id);
			const response = await fetch(
				`http://localhost:3000/api/file/trash?userId=${userId}`,
				{
					method: 'PATCH',
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ fileIds })
				}
			)
			if(!response.ok) throw new Error("Could not move to trash.");
			incrementRefreshKey();
		}catch(err: any){
			console.log("Could not delete. ", err);
			setFileError(true);
			toast.error("Could not delete the files.");
		}finally{
			setDeleting(false);
			setClicked(false);
		}
	}

	return (
		<div className='flex w-full h-screen'>
			<SideBar />
			<div className='flex flex-col w-full h-full'>
				<Topbar
					handleFileChange={handleFileChange}
					handleCreateFolder={handleCreateFolder}
					handleDelete={handleDelete}
					uploading={uploading}
					creating={creating}
					deleting={deleting}
					errorMessage={errorMessage}
					fileError={fileError}
					newFolderName={newFolderName}
					setNewFolderName={setNewFolderName}
					dialogOpen={dialogOpen}
					setDialogOpen={setDialogOpen}
					isSelected={selectedFiles.length > 0}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					handleStar={handleStar}
					clicked={clicked}
					setClicked={setClicked}
				/>
				<Separator/>
				<FileList 
					displayFiles={displayFiles}
					selectedFiles={selectedFiles}
					setSelectedFiles={setSelectedFiles}
					isLoading={isLoading}
					isLoadingError={isLoadingError}
					loadingError={loadingError}
				/>
			</div>
		</div>
	)
}

export default Home;