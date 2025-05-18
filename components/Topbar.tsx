'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from './ui/separator';
import { useDirectory } from '@/context/DirectoryContext';
import { UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Topbar() {
	const { workingDir, setWorkingDir, refreshKey, incrementRefreshKey } = useDirectory();
	const { isLoaded, isSignedIn, user } = useUser();

	const fileRef = useRef<HTMLInputElement>(null);
	const [ fileError, setFileError ] = useState<boolean>(false);
	const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
	const [ success, setSuccess ] = useState<boolean>(false);
	const [ successMessage, setSuccessMessage ] = useState<string | null>(null);

	const handleUploadClick = () => { fileRef.current?.click(); }
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setFileError(false);
		setErrorMessage(null);
		setSuccess(false);
		setSuccessMessage(null);

		try{
			if(!isLoaded || !isSignedIn || !user?.id) return;
			const files = event.target.files;
			if(!files || files.length === 0){
				setFileError(true);
				setErrorMessage("Please upload file");
				return;
			}

			const userId = user.id;
			const path = workingDir.split('/');
			const curruntDir = path.length === 0 ? '/' : path[path.length-1];

			const file = files[0];
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch(
				`http://localhost:3000/api/file/upload?userId=${encodeURIComponent(user.id)}&workingDir=${encodeURIComponent(curruntDir)}`,
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
		}
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
						<Button className='cursor-pointer text-xs'>Create Folder</Button>
					</div>
				</div>
			</div>
		</div>
	);
}