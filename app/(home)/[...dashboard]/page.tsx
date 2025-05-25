import React from 'react';
import { SideBar } from '@/components/SideBar';
import Topbar from '@/components/Topbar';
import { Separator } from '@/components/ui/separator';
import FileList from '@/components/FileTable/FileList';
import { useState, useEffect } from 'react';
import { FileData, FolderData } from '@/types/types';
import { useUser } from '@clerk/nextjs';
import { useDirectory } from '@/context/DirectoryContext';

const Home = () => {
	const { workingDir, setWorkingDir, refreshKey, incrementRefreshKey } = useDirectory();
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
	const [ dialogOpen, setDialogOpen ] =  useState<boolean>(false);

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

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setFileError(false);
		setErrorMessage(null);

		try{
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const files = event.target.files;
			if(!files || files.length === 0){
				setFileError(true);
				setErrorMessage("Please upload file");
				return;
			}

			setUploading(true);

			const userId = user.id;
			const parentId = workingDir.id === null ? '' : workingDir.id;

			const file = files[0];
			const formData = new FormData();
			formData.append('file', file);
			formData.append('userId', userId);
			if(parentId) formData.append('parentId', parentId);

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
			setErrorMessage('Could not upload file.');
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
						parentID: workingDir.id,
					})
				}
			);

			if(!response.ok) throw new Error("Could not create folder.");
			incrementRefreshKey();
		}catch(err: any){
			console.log(err);
			setErrorMessage('Could not create folder');
			setFileError(true);
		}finally{
			setCreating(false);
		}
	}

	const handleDelete = async() => {
		setFileError(false);
		setErrorMessage(null);

		try{
			setDeleting(true);
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const userId = user.id;
			const response = await fetch(
				`http://localhost:3000/api/file?userId=${userId}`,
				{
					method: 'POST',
					body: JSON.stringify({ fileIds: selectedFiles })
				}
			)
		}
		catch(err: any){
			console.log("Could not delete. ", err);
			setFileError(true);
			setErrorMessage("Could not delete the files.");
		}finally{
			setDeleting(false);
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