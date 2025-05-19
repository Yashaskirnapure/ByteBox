"use client"

import * as React from "react"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	useReactTable
} from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	})

	return (
		<div className="rounded-md border overflow-x-auto">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header, i) => (
								<TableHead
									key={header.id}
									style={{
										width: i === 0 ? "40px" : i === 1 ? "40%" : "20%",
										minWidth: i === 0 ? "40px" : "100px"
									}}
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
										style={{
											width: i === 0 ? "40px" : i === 1 ? "50%" : "auto",
											minWidth: i === 0 ? "40px" : "100px"
										}}
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