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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TopBarProps{
	handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
	handleCreateFolder: () => void,
	handleDelete: () => void,

	deleting: boolean,
	uploading: boolean,
	creating: boolean,
	errorMessage: string | null,
	fileError: boolean,

	newFolderName: string,
	setNewFolderName: (name: string) => void,

	dialogOpen: boolean,
	setDialogOpen: (state: boolean) => void,

	isSelected: boolean,

	searchQuery: string,
	setSearchQuery: (s: string) => void,
}

const Topbar: React.FC<TopBarProps> = ({ handleFileChange, handleCreateFolder, handleDelete, deleting, uploading, creating,
	errorMessage, fileError, newFolderName, setNewFolderName, dialogOpen, setDialogOpen, isSelected, searchQuery, setSearchQuery }) => {

	const fileRef = useRef<HTMLInputElement>(null);
	const handleUploadClick = () => { fileRef.current?.click(); }

	return (
		<div>
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<Input
						placeholder="Search files..."
						className="w-1/3"
						value={searchQuery}
						onChange={(e) => { setSearchQuery(e.target.value) }}
					/>
				</div>
			</div>
			<Separator/>
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<h2 className="text-[20px] font-semibold tracking-tight text-gray-800">File Manager</h2>
					<div className='flex justify-center items-center gap-2'>
						{deleting && (
							<div className="bg-blue-100 text-blue-700 border border-blue-400 px-4 py-2 rounded-md text-xs">
								Deleting. Please wait..
							</div>
						)}
						{creating && (
							<div className="bg-blue-100 text-blue-700 border border-blue-400 px-4 py-2 rounded-md text-xs">
								Creating folder. Please wait..
							</div>
						)}
						{uploading && (
							<div className="bg-blue-100 text-blue-700 border border-blue-400 px-4 py-2 rounded-md text-xs">
								Uploading file. Please wait..
							</div>
						)}
						{fileError && (
							<div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded-md text-xs">
								{errorMessage}
							</div>
						)}
						<Button
							className="cursor-pointer text-xs text-red-500 hover:text-red-500"
							variant='outline'
							disabled={!isSelected}
						>
							<Trash className="w-4 h-4 mr-2"/>
							Delete
						</Button>
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
						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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

export default Topbar;