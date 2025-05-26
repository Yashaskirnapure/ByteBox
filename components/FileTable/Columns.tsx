'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { FileText, Folder, Star } from "lucide-react";
import { FileData } from "@/types/types";
import { Button } from "../ui/button";

function formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = parseFloat((bytes / Math.pow(1024, i)).toFixed(2));

    return `${size} ${sizes[i]}`;
}

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
            return (
                <div className="flex items-center gap-2">
                    {file.type === 'folder' ? <Folder className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span>{file.name.length > 60 ? `${file.name.substring(0, 60)}.........` : file.name}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const file = row.original;
            return (
                <div>{file.type === 'file' ? file.createdAt.toLocaleDateString() : ""}</div>
            )
        }
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            const file = row.original;
            return (
                <div>{file.type === 'file' ? file.updatedAt.toLocaleDateString() : ""}</div>
            )
        }
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => {
            const file = row.original;
            return (
                <div>{file.type === 'file' ? formatFileSize(file.size) : ""}</div>
            )
        }
    },
]
