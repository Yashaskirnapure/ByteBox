'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

export type FileData = {
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    type: "file" | "folder",
    size: number,
};

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
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
    },
    {
        accessorKey: "size",
        header: "size",
    },
]
