export type FileData = {
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    type: "file" | "folder",
    size: number,
};

export type FolderData = {
	id: string | null,
	name: string,
	parentId: string | null,
};