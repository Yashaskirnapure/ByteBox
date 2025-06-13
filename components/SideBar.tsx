'use client';

import { Trash, Folders, Users, Star, Box, Settings, LogOut, User, LayoutDashboard } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

export function SideBar() {
	return (
		<div className="w-70 h-screen border-r bg-white flex flex-col justify-between py-4 px-3 space-y-6 text-sm">
			<div className="space-y-4">
				<div className="flex items-center gap-2 px-2">
					<Box className="w-5 h-5 text-black" />
					<span className="text-lg font-bold">BYTEBOX</span>
				</div>
				<Button className="cursor-pointer w-full flex items-center justify-center text-white text-sm rounded-lg px-3 py-2 font-medium">
					<LogOut className="w-4 h-4 mr-2" />
					LOGOUT
				</Button>
				<Separator/>
				<div className="px-2">
					<p className="text-muted-foreground uppercase text-xs font-semibold mb-2">Personal</p>
					<SidebarItem icon={User} label="Profile" link="profile"/>
					<SidebarItem icon={Users} label="Shared with me" link="share"/>
					<SidebarItem icon={Settings} label="Settings" link="settings"/>
				</div>
				<Separator/>
				<div className="px-2">
					<p className="text-muted-foreground uppercase text-xs font-semibold mb-2">Manage</p>
					<SidebarItem icon={Folders} label="File Manager" link="file_manager"/>
					<SidebarItem icon={LayoutDashboard} label="Dashboard" link="dashboard"/>
				</div>
				<Separator/>
				<div className="px-2">
					<SidebarItem icon={Star} label="Starred" link="star"/>
					<SidebarItem icon={Trash} label="Trash" link="trash"/>
				</div>
				<Separator/>
			</div>
		</div>
	);
}