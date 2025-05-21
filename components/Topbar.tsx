'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from './ui/separator';
import { useDirectory } from '@/context/DirectoryContext';
import { UploadCloud, Trash } from 'lucide-react';
import { useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Topbar() {
	const { workingDir, setWorkingDir, incrementRefreshKey, selectedFiles } = useDirectory();
	const { isLoaded, isSignedIn, user } = useUser();

	const fileRef = useRef<HTMLInputElement>(null);
	const [ fileError, setFileError ] = useState<boolean>(false);
	const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
	const [ newFolderName, setNewFolderName ] = useState<string>('');
	const [ uploading, setUploading ] = useState<boolean>(false);

	const handleUploadClick = () => { fileRef.current?.click(); }
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
				`http://localhost:3000/api/file/upload?userId=${encodeURIComponent(userId)}&workingDir=${encodeURIComponent(parentId)}`,
				{
					method: 'POST',
					body: formData,
				}
			);
			if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
			toast("Upload successfull", { description: "refreshing....", });
			incrementRefreshKey();
		}catch(err: any){
			setErrorMessage('Could not upload file.');
			setFileError(true);
		}finally{
			setUploading(false);
		}
	}

	const handleCreateFolder = async() => {
		try{
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const userId = user.id;
			const curruntDir = workingDir.id !== null ? workingDir.name.split('/')[-1] : '/';

			const response = await fetch(
				'localhost:3000/api/folder',
				{
					method: 'POST',
					body: JSON.stringify({
						name: newFolderName,
						userId: userId,
						parentId: workingDir.id,
					})
				}
			);

			if(!response.ok) throw new Error("Could not create folder.");
			toast("Folder created successfully", { description: "refreshing....", });
			incrementRefreshKey();
		}catch(err: any){
			setErrorMessage('Could not create folder');
			setFileError(true);
		}
	}

	const handleDelete = async() => {
		try{}
		catch(err: any){}
	}

	return (
		<div>
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<Input placeholder="Search files..." className="w-1/3" />
				</div>
			</div>
			<Separator/>
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<h2 className="text-[20px] font-semibold tracking-tight text-gray-800">File Manager</h2>
					<div className='flex justify-center items-center gap-2'>
						<Button
							className="cursor-pointer text-xs text-red-500 hover:text-red-500"
							variant='outline'
						>
							<Trash className="w-4 h-4 mr-2"/>
							Delete
						</Button>
						{uploading && (
							<div className="bg-blue-100 text-blue-700 border border-blue-400 px-4 py-2 rounded-md text-xs">
								Uploading. Please wait..
							</div>
						)}
						{fileError && (
							<div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded-md text-xs">
								{errorMessage}
							</div>
						)}
						<Input 
							hidden
							ref={fileRef}
							id="file"
							type="file"
							onChange={handleFileChange}
						/>
						<Button
							onClick={handleUploadClick}
							className="cursor-pointer text-xs"
							variant='outline'
						>
							<UploadCloud className="w-4 h-4 mr-2"/>
							Upload
						</Button>
						<Dialog>
							<DialogTrigger asChild>
								<Button className='cursor-pointer text-xs'>Create Folder</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Create New Folder</DialogTitle>
									<DialogDescription>
										Name your new folder.
									</DialogDescription>
								</DialogHeader>
								<Input
									id="name"
									placeholder='Untitled Folder'
									className="col-span-4"
									onChange={(e) => { setNewFolderName(e.target.value) }}
								/>
								<Button
									className='cursor-pointer col-span-4'
									onClick={handleCreateFolder}
								>
									Create
								</Button>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
		</div>
	);
}