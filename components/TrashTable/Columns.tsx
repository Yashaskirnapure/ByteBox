'use client';

import { ColumnDef } from "@tanstack/react-table";
import { useTrashNavigation } from "@/context/TrashNavigationContext";
import { FileText, Folder } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { FileData } from "@/types/types";

export const columns: ColumnDef<FileData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const file = row.original;
            const { setWorkingDir } = useTrashNavigation();
            return (
                <div>
                    {
                        file.type === 'folder' ?
                            <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => { setWorkingDir({ id: file.id, name: file.name }) }}>
                                <Folder className="w-4 h-4" />
                                <span>{file.name.length > 60 ? `${file.name.substring(0, 60)}.........` : file.name}</span>
                            </div> :
                        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                            <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    <span>{file.name.length > 60 ? `${file.name.substring(0, 60)}.........` : file.name}</span>
                            </div>
                        </a>
                    }
                </div>
            )
        }
    },
]