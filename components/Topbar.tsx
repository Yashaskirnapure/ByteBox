'use client';

import { Label } from './ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Separator } from './ui/separator';
import { useDirectory } from '@/context/DirectoryContext';
import { UploadCloud } from 'lucide-react';
import { useRef } from 'react';

export default function Topbar() {
	const { workingDir, setWorkingDir } = useDirectory();
	const fileRef = useRef<HTMLInputElement>(null);

	const handleUploadClick = () => { fileRef.current?.click(); }
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		
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
						<Input hidden id="file" type="file" />
						<Button
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