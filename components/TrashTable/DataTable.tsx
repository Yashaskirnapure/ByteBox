"use client"

import React from "react";
import { useEffect } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTrashNavigation } from "@/context/TrashNavigationContext";
import { FileData } from "@/types/types";
import { FolderUp } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[],
    setSelectedFiles: (files: Array<FileData>) => void,
}

export function DataTable<TData, TValue>({ columns, data, setSelectedFiles }: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const { workingDir, setWorkingDir, moveUp } = useTrashNavigation();

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    });

    useEffect(() => {
        const files = table.getSelectedRowModel().rows.map(r => r.original as FileData);
        setSelectedFiles(files);
    }, [rowSelection]);

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header, i) => (
                                <TableHead
                                    key={header.id}
                                >
                                    {header.isPlaceholder ? null : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {workingDir.id === null ? 
                        null :
                        <TableRow className="text-muted-foreground">
                            <TableCell className="p-2 px-2"></TableCell>
                            <TableCell className="p-2 px-2">
                                <FolderUp className="w-5 h-5 cursor-pointer" onClick={(e) => { moveUp() } }/>
                            </TableCell>
                        </TableRow>
                    }
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="text-muted-foreground"
                            >
                                {row.getVisibleCells().map((cell, i) => (
                                    <TableCell
                                        key={cell.id}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}