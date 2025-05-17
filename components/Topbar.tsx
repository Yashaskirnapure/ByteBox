'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from './ui/separator';
import { useDirectory } from '@/context/DirectoryContext';
import { UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Topbar() {
	const { workingDir, setWorkingDir } = useDirectory();
	const fileRef = useRef<HTMLInputElement>(null);
	const [ fileInputError, setFileInputError ] = useState<boolean>(false);
	const [ error, setError ] = useState<string | null>(null);

	const handleUploadClick = () => { fileRef.current?.click(); }
	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if(!files || files.length === 0){
			setFileInputError(true);
			setError("Please upload file");
			return;
		}

		const file = files[0];
		const formData = new FormData();
		formData.append('file', file);

		const response = await fetch(``)
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
						<Input hidden ref={fileRef} id="file" type="file" />
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