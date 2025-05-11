    import {
    UploadCloud,
    Trash,
    FileText,
    Folder,
    Users,
    Clock,
    Star,
    DiscAlbum,
    Box
  } from "lucide-react";
  
  export function SideBar() {
    return (
      <div className="w-64 h-screen border-r bg-white flex flex-col justify-between py-4 px-3 space-y-6 text-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Box className="w-5 h-5 text-black" />
            <span className="text-lg font-bold">BYTEBOX</span>
          </div>
          <button className="w-full flex items-center justify-center bg-black text-white text-sm rounded-lg px-3 py-2 font-medium hover:bg-neutral-800 transition">
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload
          </button>
  
          {/* Personal Group */}
          <div className="space-y-1 px-2">
            <p className="text-muted-foreground uppercase text-xs font-semibold mb-1">
              Personal
            </p>
            <SidebarItem icon={Star} label="Priority" />
            <SidebarItem icon={Users} label="Shared with me" />
            <SidebarItem icon={Clock} label="Meetings" />
          </div>
  
          {/* Cloud Group */}
          <div className="space-y-1 px-2">
            <p className="text-muted-foreground uppercase text-xs font-semibold mb-1">
              Cloud
            </p>
            <SidebarItem icon={Folder} label="Team Cloud" active />
            <SidebarItem icon={DiscAlbum} label="Space Recordings" />
            <SidebarItem icon={DiscAlbum} label="Space Snapshots" />
            <SidebarItem icon={Trash} label="Trash" />
          </div>
  
          {/* Quick Access */}
          <div className="space-y-1 px-2">
            <p className="text-muted-foreground uppercase text-xs font-semibold mb-1">
              Quick Access
            </p>
            <SidebarItem icon={FileText} label="3.png-05-11-23..." />
            <SidebarItem icon={FileText} label="3.png-05-11-23..." />
          </div>
        </div>
      </div>
    );
  }
  
  function SidebarItem({
    icon: Icon,
    label,
    active = false
  }: {
    icon: React.ElementType;
    label: string;
    active?: boolean;
  }) {
    return (
      <div
        className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer ${
          active
            ? "bg-muted text-foreground font-medium"
            : "text-muted-foreground hover:bg-muted transition"
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
    );
  }
  