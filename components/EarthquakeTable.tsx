"use client";

import { useState, useMemo, memo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import type { EarthquakeData } from "@/utils/mapUtils";
import MagnitudeBadge from "./MagnitudeBadge";

interface EarthquakeTableProps {
  data: EarthquakeData[];
  isVisible: boolean;
  onRowClick: (id: string, position: [number, number, number]) => void;
  selectedId: string | null;
  onViewDetails: (id: string) => void;
}

const columnHelper = createColumnHelper<EarthquakeData>();

function EarthquakeTable({
  data,
  isVisible,
  onRowClick,
  selectedId,
  onViewDetails,
}: EarthquakeTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "magnitude", desc: true },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("magnitude", {
        header: "Magnitude",
        cell: (info) => {
          const mag = info.getValue();
          return mag !== null && mag !== undefined ? (
            <MagnitudeBadge magnitude={mag} size="sm" />
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("place", {
        header: "Location",
        cell: (info) => {
          const place = info.getValue();
          return (
            <span className="text-sm">
              {place || "N/A"}
            </span>
          );
        },
      }),
      columnHelper.accessor("depth", {
        header: "Depth (km)",
        cell: (info) => {
          const depth = info.getValue();
          return depth !== null && depth !== undefined ? (
            <span className="text-sm">{depth.toFixed(1)}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("time", {
        header: "Time",
        cell: (info) => {
          const time = info.getValue();
          return (
            <span className="text-sm">
              {time ? new Date(time).toLocaleString() : "N/A"}
            </span>
          );
        },
      }),
      columnHelper.accessor("properties.alert", {
        header: "Alert",
        cell: (info) => {
          const alert = info.getValue();
          if (!alert) return <span className="text-xs text-slate-400">N/A</span>;
          const colors = {
            green: "bg-green-100 text-green-800 border-green-300",
            yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
            orange: "bg-orange-100 text-orange-800 border-orange-300",
            red: "bg-red-100 text-red-800 border-red-300",
          };
          return (
            <span className={`text-xs font-semibold px-2 py-1 rounded border ${colors[alert as keyof typeof colors] || ""}`}>
              {alert.toUpperCase()}
            </span>
          );
        },
      }),
      columnHelper.accessor("properties.tsunami", {
        header: "Tsunami",
        cell: (info) => {
          const tsunami = info.getValue();
          return tsunami === 1 ? (
            <span className="text-xs font-bold text-red-600">⚠️ YES</span>
          ) : tsunami === 0 ? (
            <span className="text-xs text-slate-400">No</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.felt", {
        header: "Felt Reports",
        cell: (info) => {
          const felt = info.getValue();
          return felt !== null && felt !== undefined ? (
            <span className="text-xs font-medium text-blue-600">{felt.toLocaleString()}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.sig", {
        header: "Significance",
        cell: (info) => {
          const sig = info.getValue();
          if (sig === null || sig === undefined) {
            return <span className="text-xs text-slate-400">N/A</span>;
          }
          const color = sig > 600 ? "text-red-600" : sig > 300 ? "text-orange-600" : "text-slate-600";
          return <span className={`text-xs font-medium ${color}`}>{sig}</span>;
        },
      }),
      columnHelper.accessor("properties.status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          if (!status) return <span className="text-xs text-slate-400">N/A</span>;
          const color = status === "reviewed" ? "text-green-600" : "text-slate-500";
          return <span className={`text-xs ${color} capitalize`}>{status}</span>;
        },
      }),
      columnHelper.accessor("properties.magType", {
        header: "Mag Type",
        cell: (info) => {
          const magType = info.getValue();
          return magType ? (
            <span className="text-xs font-medium text-slate-700 uppercase">{magType}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.cdi", {
        header: "CDI",
        cell: (info) => {
          const cdi = info.getValue();
          return cdi !== null && cdi !== undefined ? (
            <span className="text-xs font-medium text-purple-600">{cdi.toFixed(1)}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.mmi", {
        header: "MMI",
        cell: (info) => {
          const mmi = info.getValue();
          return mmi !== null && mmi !== undefined ? (
            <span className="text-xs font-medium text-indigo-600">{mmi.toFixed(1)}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.nst", {
        header: "Stations",
        cell: (info) => {
          const nst = info.getValue();
          return nst !== null && nst !== undefined ? (
            <span className="text-xs font-medium text-slate-600">{nst}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.gap", {
        header: "Gap (°)",
        cell: (info) => {
          const gap = info.getValue();
          return gap !== null && gap !== undefined ? (
            <span className="text-xs font-medium text-slate-600">{gap}°</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.dmin", {
        header: "Distance",
        cell: (info) => {
          const dmin = info.getValue();
          return dmin !== null && dmin !== undefined ? (
            <span className="text-xs font-medium text-slate-600">{dmin.toFixed(2)}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.rms", {
        header: "RMS",
        cell: (info) => {
          const rms = info.getValue();
          return rms !== null && rms !== undefined ? (
            <span className="text-xs font-medium text-slate-600">{rms.toFixed(2)}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.net", {
        header: "Network",
        cell: (info) => {
          const net = info.getValue();
          return net ? (
            <span className="text-xs font-medium text-blue-700 uppercase">{net}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.updated", {
        header: "Updated",
        cell: (info) => {
          const updated = info.getValue();
          return updated ? (
            <span className="text-xs text-slate-600">
              {new Date(updated).toLocaleString()}
            </span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.type", {
        header: "Type",
        cell: (info) => {
          const type = info.getValue();
          return type ? (
            <span className="text-xs font-medium text-slate-700 capitalize">{type}</span>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.accessor("properties.url", {
        header: "USGS Link",
        cell: (info) => {
          const url = info.getValue();
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
                inline-flex items-center gap-1
                text-xs font-medium text-blue-600
                hover:text-blue-800 hover:underline
                transition-colors
              "
            >
              View
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span className="text-xs text-slate-400">N/A</span>
          );
        },
      }),
      columnHelper.display({
        id: "moreDetails",
        header: "More Details",
        cell: (info) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(info.row.original.id);
            }}
            className="
              inline-flex items-center gap-1
              bg-gradient-to-r from-blue-600 to-cyan-600
              hover:from-blue-700 hover:to-cyan-700
              text-white font-semibold
              px-3 py-1.5 rounded-md
              text-xs
              transition-all duration-200
              hover:shadow-md hover:scale-105
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </button>
        ),
      }),
    ],
    [onViewDetails]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  const handleRowClick = useCallback(
    (id: string, position: [number, number, number]) => {
      onRowClick(id, position);
    },
    [onRowClick]
  );

  return (
    <div
      className={`
      fixed bottom-0 left-0 right-0
      bg-white/95 backdrop-blur-xl
      border-t border-slate-200/50
      shadow-2xl shadow-black/10
      max-h-[50vh] md:max-h-[50vh]
      overflow-hidden
      transition-transform duration-300 ease-out
      ${isVisible ? "translate-y-0" : "translate-y-full"}
      z-50
    `}
    >
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(50vh-4rem)]">
        <table className="w-full text-sm">
          <thead className="
            bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100
            border-b-2 border-slate-200
            backdrop-blur-sm
            sticky top-0 z-10
          ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="
                          flex items-center gap-2
                          font-bold text-slate-700 uppercase text-xs tracking-wider
                          hover:text-blue-600
                          transition-colors duration-150
                        "
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="text-slate-400 text-base">
                          {{
                            asc: "↑",
                            desc: "↓",
                          }[header.column.getIsSorted() as string] ?? "↕"}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.original.id, row.original.position)}
                className={`
                  cursor-pointer
                  border-b border-slate-100
                  transition-all duration-150
                  ${
                    row.original.id === selectedId
                      ? "bg-gradient-to-r from-blue-100 to-cyan-100 ring-2 ring-inset ring-blue-500/50"
                      : "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50"
                  }
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="
        bg-gradient-to-r from-slate-50 via-white to-slate-50
        border-t border-slate-200
        px-6 py-4
        flex items-center justify-between
      ">
        <div className="text-sm text-slate-600 font-medium">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of{" "}
          {data.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="
              bg-white border-2 border-slate-200
              hover:border-blue-500 hover:text-blue-600 hover:shadow-md
              hover:scale-105
              disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300
              disabled:hover:scale-100
              rounded-lg px-4 py-2
              font-medium text-sm
              transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="
              bg-white border-2 border-slate-200
              hover:border-blue-500 hover:text-blue-600 hover:shadow-md
              hover:scale-105
              disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300
              disabled:hover:scale-100
              rounded-lg px-4 py-2
              font-medium text-sm
              transition-all duration-200
              focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(EarthquakeTable);
