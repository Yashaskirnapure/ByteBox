'use client';

import React, { useEffect, useState } from 'react';
import { SideBar } from '@/components/SideBar';
import TrashList from '@/components/TrashTable/TrashList';
import { Separator } from '@radix-ui/react-separator';
import { FileData } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash, Brush, Undo } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { useDirectory } from '@/context/DirectoryContext';
import { useTrashNavigation } from '@/context/TrashNavigationContext';

const TrashPage = () => {
	const [ files, setFiles ] = useState<FileData[]>([]);
	const [ displayFiles, setDisplayFiles ] = useState<FileData[]>([]);
	const [ selectedFiles, setSelectedFiles ] = useState<FileData[]>([]);
	const [ isLoading, setIsLoading ] = useState<boolean>(false);
	const [ isLoadingError, setIsLoadingError ] = useState<boolean>(false);
	const [ loadingError, setLoadingError ] = useState<string | null> (null);
	const { isLoaded, isSignedIn, user } = useUser();
	const [ searchQuery, setSearchQuery ] = useState<string>('');
	const [ restoring, setRestoring ] = useState<boolean>(false);

	const { refreshKey, incrementRefreshKey } = useDirectory();
	const { workingDir, setWorkingDir } = useTrashNavigation();

	useEffect(() => {
		const searchResults = files.filter((file) => { return file.name.toLowerCase().includes(searchQuery); });
		setDisplayFiles(searchResults);
	}, [ searchQuery ]);

	useEffect(() => {
		const fetchFiles = async () => {
			try{
				if(!isLoaded || !isSignedIn || !user?.id) return;
				setIsLoading(true);
				
				const trashDir = workingDir.id === null ? "": workingDir.id;
				const response = await fetch(`http://localhost:3000/api/trash?userId=${user.id}&trashDir=${trashDir}`);
				if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

				const body = await response.json();
				const fileList = body.content;

				const normalized: FileData[] = fileList.map((item: any) => {
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
				setIsLoading(false);
			}catch(err: any){
				setIsLoadingError(true);
				setLoadingError("Error loading files");
				toast.error("Could not load files");
				console.error("Error loading files", err);
			}finally{
				setIsLoadingError(false);
			}
		}

		fetchFiles();
	}, [isSignedIn, isLoaded, user, refreshKey, workingDir]);

	const handleRestore = async() => {
		try{
			if(!isLoaded || !isSignedIn || !user.id) return;
			setRestoring(true);
			
			const fileIds = selectedFiles.map(item => item.id)
			const response = await fetch(``,
			{
				method: 'PATCH',
				body: JSON.stringify({ fileIds })
			});

			incrementRefreshKey();
		}catch(err: any){
			setIsLoadingError(true);
			setLoadingError("Error loading files");
			toast.error("Could not load files");
			console.error("Error loading files", err);
		}
	}

	const handleDelete = async() => {}
	const handleClear = async() => {}

  return (
		<div className='flex w-full h-screen'>
			<SideBar />
			<div className='flex flex-col w-full h-full'>
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
			<Separator className="h-px w-full bg-gray-200" />
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<h2 className="text-[20px] font-semibold tracking-tight text-gray-800">Trash</h2>
					<div className='flex justify-center items-center gap-2'>
						<Button
							className="cursor-pointer text-xs"
							variant='outline'
							disabled={selectedFiles.length === 0}
						>
							<Undo className="w-4 h-4 mr-2"/>
							Restore
						</Button>
						<Button
							className="cursor-pointer text-xs"
							variant='outline'
							disabled={selectedFiles.length === 0}
						>
							<Trash className="w-4 h-4 mr-2"/>
							Delete
						</Button>
						<Button
							className="cursor-pointer text-xs"
						>
							<Brush className="w-4 h-4 mr-2"/>
							Clear
						</Button>
					</div>
				</div>
			</div>
			<Separator className="h-px w-full bg-gray-200" />
			<TrashList
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

export default TrashPage