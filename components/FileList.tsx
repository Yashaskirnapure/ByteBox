import React from 'react';
import { useState, useEffect } from 'react';
import { Folder, File } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

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
	const [ workingDir, setWorkingDir ] = useState<string>("/");
	const [ loadingError, setLoadingError ] = useState<string | null>(null);
	const { isLoaded, isSignedIn, user } = useUser();
	const router = useRouter();

	if(!isLoaded) return <h1>Loading....please wait</h1>
	if(!isSignedIn){
		router.push('/sign-in');
		return;
	}

	useEffect(() => {
		const fetchFiles = async () => {}
		fetchFiles();
	}, [])

	return (
		<div className="w-full h-full p-3 bg-gray-100">
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
		</div>
	);
};

export default FileList;
