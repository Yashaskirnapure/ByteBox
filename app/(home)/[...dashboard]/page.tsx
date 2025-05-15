import React from 'react';
import { SideBar } from '@/components/SideBar';
import Topbar from '@/components/Topbar';
import { Separator } from '@/components/ui/separator';
import FileList from '@/components/FileList';

const Home = () => {
	return (
		<div className='flex w-full h-screen'>
			<SideBar />
			<div className='flex flex-col w-full h-full'>
				<Topbar/>
				<Separator/>
				<FileList/>
			</div>
		</div>
	)
}

export default Home;