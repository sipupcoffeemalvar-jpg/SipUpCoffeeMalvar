"use client";

import "../src/styles/styles.css";
import "../src/styles/productTable.css";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table";

import {
  CreateDailySales,
  GetMonthlySalesReport,
  updateMonthlySales,
} from "./../actions/report";
import { IMonthlySales } from "../lib/types/Reports";
import MonthYearPicker from "../components/common/MonthYear";
import { ArrowUpDown, Save } from "lucide-react";

const MonthlySales = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
    }).format(today);
  });

  const [globalFilter, setGlobalFilter] = useState("");

  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");

  const [editedRows, setEditedRows] = useState<
    Record<string, Partial<IMonthlySales>>
  >({});

  /*
    Create new record for today under tblMonthlySales 
  */

  const isEditable = (date: string, isCreated: boolean): boolean => {
    const today = new Date();
    const rowDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    rowDate.setHours(0, 0, 0, 0);

    return isCreated || rowDate <= today;
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  type EditableInputProps = {
    value: number | string;
    onChange: (value: string) => void;
  };
  const handleInputChange = (
    id: number,
    columnId: keyof IMonthlySales,
    value: string,
  ) => {
    setEditedRows((prev) => {
      const updated = {
        ...prev,
        [String(id)]: {
          ...prev[String(id)],
          [columnId]: value,
        },
      };

      return updated;
    });
  };
  const handleInputChange2 = (
    id: number,
    columnId: keyof IMonthlySales,
    value: string,
  ) => {
    setEditedRows((prev) => ({
      ...prev,
      [String(id)]: {
        ...prev[String(id)],
        [columnId]: value,
      },
    }));
  };
  
  const EditableInput = ({ value, onChange }: EditableInputProps) => {
    return (
      <input
        type="number"
        placeholder="0.00"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    );
  };

  useEffect(() => {
    const initialize = async () => {
      const result = await CreateDailySales();

      if (result.error) {
        console.error(result.error);
        return;
      }

      refetch();
    };

    initialize();
  }, []);

  const {
    data: monthlySalesData = [],
    isFetching,
    error,
    refetch,
  } = useQuery<IMonthlySales[]>({
    queryKey: ["monthlySales", selectedMonth],
    queryFn: async () => {
      const result = await GetMonthlySalesReport(selectedMonth);
      // console.log("Monthly Sales Data:", result);
      // console.log("First Row:", monthlySalesData[0]);
      if (result.error) {
        throw new Error(result.error);
      }

      return result.reportDailySales ?? [];
    },
    enabled: !!selectedMonth,
    staleTime: 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const columns = useMemo<ColumnDef<IMonthlySales>[]>(
    () => [
      {
        accessorKey: "day_number",
        header: "Date",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      // {
      //   accessorKey: "BOH",
      //   header: "BOH",
      //   cell: ({ row, table }) => {
      //     const meta = table.options.meta as {
      //       editedRows: Record<string, Partial<IMonthlySales>>;
      //       handleInputChange: (
      //         id: number,
      //         columnId: keyof IMonthlySales,
      //         value: string,
      //       ) => void;
      //     };

      //     const editable = isEditable(
      //       row.original.DateAdded ?? "",
      //       row.original.iscreated ?? false,
      //     );

      //     const id = row.original.ID || 0;

      //     return editable ? (
      //       <EditableInput
      //         value={meta.editedRows[String(id)]?.BOH ?? row.original.BOH ?? 0}
      //         onChange={(value) => meta.handleInputChange(id, "BOH", value)}
      //       />
      //     ) : (
      //       <span>{row.original.BOH ?? 0}</span>
      //     );
      //   },
      // },

      {
        accessorKey: "BOH",
        header: "BOH",
        cell: ({ row, table, getValue }) => {
          const meta = table.options.meta as {
            editedRows: Record<string, Partial<IMonthlySales>>;
            handleInputChange: (
              id: number,
              columnId: keyof IMonthlySales,
              value: string,
            ) => void;
          };

          const id = row.original.ID || 0;
          const value =
            meta.editedRows[String(id)]?.BOH ?? getValue<number>() ?? 0;

          return isEditable(
            row.original.DateAdded ?? "",
            row.original.iscreated ?? false,
          ) ? (
            <div className=" w-[100px]">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={value === 0 ? "-" : value}
                onChange={(e) =>
                  meta.handleInputChange(id, "BOH", e.target.value)
                }
                className="input-field"
              />
            </div>
          ) : (
            <span>{value === 0 ? "-" : value}</span>
          );
        },
      },
      {
        accessorKey: "Cash",
        header: "Current Cash",
        cell: ({ row, table, getValue }) => {
          const meta = table.options.meta as {
            editedRows: Record<string, Partial<IMonthlySales>>;
            handleInputChange: (
              id: number,
              columnId: keyof IMonthlySales,
              value: string,
            ) => void;
          };

          const id = row.original.ID || 0;
          const value =
            meta.editedRows[String(id)]?.Cash ?? getValue<number>() ?? 0;

          return isEditable(
            row.original.DateAdded ?? "",
            row.original.iscreated ?? false,
          ) ? (
            <div className=" w-[100px]">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={value === 0 ? "-" : value}
                onChange={(e) =>
                  meta.handleInputChange(id, "Cash", e.target.value)
                }
                className="input-field"
              />
            </div>
          ) : (
            <span>{value === 0 ? "-" : value}</span>
          );
        },
      },
      {
        accessorKey: "GCash",
        header: "Current GCash",
        cell: ({ row, table, getValue }) => {
          const meta = table.options.meta as {
            editedRows: Record<string, Partial<IMonthlySales>>;
            handleInputChange: (
              id: number,
              columnId: keyof IMonthlySales,
              value: string,
            ) => void;
          };

          const id = row.original.ID || 0;
          const value =
            meta.editedRows[String(id)]?.GCash ?? getValue<number>() ?? 0;

          return isEditable(
            row.original.DateAdded ?? "",
            row.original.iscreated ?? false,
          ) ? (
            <div className=" w-[100px]">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={value === 0 ? "-" : value}
                onChange={(e) =>
                  meta.handleInputChange(id, "GCash", e.target.value)
                }
                className="input-field"
              />
            </div>
          ) : (
            <span>{value === 0 ? "-" : value}</span>
          );
        },
      },
      {
        accessorKey: "Grab",
        header: "Current Grab",
        cell: ({ row, table, getValue }) => {
          const meta = table.options.meta as {
            editedRows: Record<string, Partial<IMonthlySales>>;
            handleInputChange: (
              id: number,
              columnId: keyof IMonthlySales,
              value: string,
            ) => void;
          };

          const id = row.original.ID || 0;
          const value =
            meta.editedRows[String(id)]?.Grab ?? getValue<number>() ?? 0;

          return isEditable(
            row.original.DateAdded ?? "",
            row.original.iscreated ?? false,
          ) ? (
            <div className=" w-[100px]">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={value === 0 ? "-" : value}
                onChange={(e) =>
                  meta.handleInputChange(id, "Grab", e.target.value)
                }
                className="input-field"
              />
            </div>
          ) : (
            <span>{value === 0 ? "-" : value}</span>
          );
        },
      },
      {
        accessorKey: "Cups",
        header: "Cups",
        meta: {
          className: "bg-gray-300",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Sales_Cash",
        header: "Cash",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Sales_GCash",
        header: "GCash",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Sales_Grab",
        header: "Grab",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "TotalSales",
        header: "Total Sales",
        meta: {
          className: "bg-gray-300",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "ExpectedCash",
        header: "Expected Cash",
        meta: {
          className: "bg-gray-300",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Variance",
        header: "Variance",
        meta: {
          className: "bg-gray-300",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Ice",
        header: "Ice",
        meta: {
          className: "bg-gray-200",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Water",
        header: "Water",
        meta: {
          className: "bg-gray-200",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Eelctricity",
        header: "Power",
        meta: {
          className: "bg-gray-200",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Rent",
        header: "Rent",
        meta: {
          className: "bg-gray-200",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "RawMats",
        header: "RawMats",
        meta: {
          className: "bg-gray-200",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Others",
        header: "Others",
        meta: {
          className: "bg-gray-200",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Expense",
        header: "Expense",
        meta: {
          className: "bg-gray-300",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Salary1",
        header: "Salary 1",
        meta: {
          className: "bg-green-100",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Salary2",
        header: "Salary2",
        meta: {
          className: "bg-green-100",
        },
        cell: (info) => {
          return (
            <div className="flex items-center justify-center h-full">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "Others_Desc",
        header: "Remarks",
        cell: (info) => {
          return (
            <div className="w-[250px]">
              <textarea
                rows={3}
                value={(info.getValue() as string | null) ?? ""}
                disabled
                
                className="w-full bg-gray-100 text-gray-700 border rounded px-2 py-1 cursor-not-allowed"
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: monthlySalesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    meta: {
      editedRows,
      handleInputChange,
    },

    state: {
      columnFilters,
      globalFilter,
    },

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
  });

  //   if (isLoading) {
  //     return (
  //       <div className="flex items-center justify-center p-8">
  //         <div className="text-gray-400">Loading task . . . </div>
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     return (
  //       <div className="rounded-lg p-4 bg-red-900/20 text-red-400">
  //         Error loading task:{" "}
  //         {error instanceof Error ? error.message : "Unknown Eror"}
  //       </div>
  //     );
  //   }
  //TODO:
  //ang cash sales ay 1 column lang dapat hiwalay ang cash at gcash for now cash muna since no column for gcash
  //need i add total sales, expense, net income? at total money ng buong buwan? at total variance?
  //add button for single update

  const queryClient = useQueryClient();
  const handleSaveAll = async () => {
    try {
      const updatedData = Object.entries(editedRows).map(([id, changes]) => ({
        ID: Number(id),
        ...changes,
      }));

      if (updatedData.length === 0) {
        alert("No changes to save.");
        return;
      }

      for (const item of updatedData) {
        // console.log({

        //   ID: item.ID,
        //   BOH: item.BOH,
        //   Cash: item.Cash,
        //   GCash: item.GCash,
        //   Grab: item.Grab,
        // });

        const result = await updateMonthlySales(item.ID, {
          BOH: item.BOH,
          Cash: item.Cash,
          GCash: item.GCash,
          Grab: item.Grab,
        });

        if (result.error) {
          throw new Error(`ID ${item.ID}: ${result.error}`);
        }
      }

      await queryClient.invalidateQueries({
        queryKey: ["monthlySales", selectedMonth],
      });
      setEditedRows({});

      alert("All Monthly Sales records saved successfully!");
    } catch (error) {
      //console.error("Error saving data:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save Monthly Sales.",
      );
    }
  };

  return (
    <>
      <div className="product-page">
        <div className="flex items-center justify-between">
          <MonthYearPicker
            value={selectedMonth}
            onChange={handleMonthChange}
          />

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-6 py-2.5 bg-[#0d6efd] text-white rounded-lg shadow-md hover:bg-[#0b5ed7]
              hover:shadow-lg active:scale-95 w-40 flex justify-center items-center gap-2 text-center">
            <Save size={18}  /> Save All
          </button>
        </div>
        <div className="product-table-scroll">
          <table className="product-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`header-cell ${
                        (header.column.columnDef.meta as any)?.className ?? ""
                      }`}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-white"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {{
                            asc: " ↑",
                            desc: " ↓",
                          }[header.column.getIsSorted() as string] ?? " :"}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-900">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td className="text-gray-700" colSpan={columns.length}>
                    {globalFilter
                      ? "No product found matching search!"
                      : "No product found. Create"}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="cursor-pointer">
                    {row.getVisibleCells().map((cell) => {
                      const value = cell.getValue();
                      const isNegative =
                        typeof value === "number" && value < 0;

                      return (
                        <td
                          key={cell.id}
                          className={`${
                            (cell.column.columnDef.meta as any)?.className ?? ""
                          } ${isNegative ? "!text-red-600" : ""}`}
                        >
                          {isNegative
                            ? `(${Math.abs(value).toLocaleString("en-PH")})`
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MonthlySales;
