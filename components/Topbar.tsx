'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Separator } from './ui/separator';
import { useDirectory } from '@/context/DirectoryContext';

export default function Topbar() {
	const { workingDir, setWorkingDir } = useDirectory();

	return (
		<div>
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<Input placeholder="Search files..." className="w-1/3" />
					<User />
				</div>
			</div>
			<Separator/>
			<div className="px-4 py-2 space-y-2">
				<div className="flex justify-between items-center">
					<h2 className="text-[20px] font-semibold tracking-tight text-gray-800">File Manager</h2>
					<Button className='cursor-pointer text-xs'>Create Folder</Button>
				</div>
			</div>
		</div>
	);
}