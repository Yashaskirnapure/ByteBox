import React from 'react';

export function SidebarItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean; }) {
	return (
		<div className={`flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer ${active
		? "bg-muted text-foreground font-medium"
		: "text-muted-foreground hover:bg-muted transition"
		}`}
		>
			<Icon className="w-4 h-4" />
			<span>{label}</span>
		</div>
	);
}