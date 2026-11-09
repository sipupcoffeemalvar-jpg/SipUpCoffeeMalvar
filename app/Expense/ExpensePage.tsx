"use client";

import "../src/styles/styles.css";
import "../src/styles/productTable.css";
import PreviewExpense from "../components/Expense/PopupExpense"
import PageHeader from "../components/common/PageHeader";

import Link from "next/link";
import {
  ArrowRight,
  House,
  Search,
  X,
  CalendarDays,
  Coffee,
  Eye,
  Filter,
  Plus,
  Settings2,
} from "lucide-react";

import type { IExpense } from "../lib/types/expense";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import { getAllExpense } from "../actions/expense";
import MonthYearPicker from "../components/common/MonthYear";
import DatePicker from "../components/common/DatePicker";

// Convert DateAdded into YYYY-MM-DD
const getDateKeyMonthAndYear = (value: string | Date | null) => {
  if (!value) return "";

  const dateString = String(value);

  // PostgreSQL DATE format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getDateKey = (value: string | Date | null) => {
  if (!value) return "";

  const dateString = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const ExpensePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IExpense | null>(null);
  const [ExpenseHistory, setExpenseHistory] = useState<IExpense[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");
const filterCurrentMonth = () => {
  const today = new Date();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const lastDay = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  );

  const formatDate = (date: Date) => {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const from = formatDate(firstDay);
  const to = formatDate(lastDay);

  setFilterDateFrom(from);
  setFilterDateTo(to);

  // Apply filter immediately
  setAppliedDateFrom(from);
  setAppliedDateTo(to);
};

  const [globalFilter, setGlobalFilter] = useState(() => {
    const today = new Date();

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
    }).format(today);
  });

  // Fetch report data
  useEffect(() => {
    let isMounted = true;

    const fetchReport = async () => {
      try {
              const result = await getAllExpense();
                 
              if (result.error) {
                throw new Error(result.error);
              }
        
              if (isMounted) {
                setExpenseHistory(result.data ?? []);
              }


      } catch (error) {
        console.error("Failed to fetch Expense:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, []);

  // Table columns
  const columns = useMemo<ColumnDef<IExpense>[]>(
    () => [
      // {
      //   id: "ExpenseID",
      //   header: "ID",
      //   cell: ({ row }) => (
      //     <div className="flex flex-col gap-1">
      //       <span className="font-semibold text-slate-700">
      //         {row.original.ExpenseID}
      //       </span>

      //       {/* <span className="text-xs text-slate-500">
      //         {row.original.ExpenseID?.length ?? 0} items
      //       </span> */}
      //     </div>
      //   ),
      // },
      {
        id: "No",
        header: "#",
        cell: ({ row }) => (
          <span className="font-semibold text-slate-800">
            {row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: "Ice",
        header: "Ice",
      },
      {
        accessorKey: "Water",
        header: "Water",
        cell: ({ getValue }) => (
          <span>
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "Electricity",
        header: "Electricity",
        cell: ({ getValue }) => <span>₱{Number(getValue()).toFixed(2)}</span>,
      },
      {
        accessorKey: "Rent",
        header: "Rent",
        cell: ({ getValue }) => <span>₱{Number(getValue()).toFixed(2)}</span>,
      },
      {
        accessorKey: "RawMats",
        header: "RawMats",
        cell: ({ getValue }) => (
          <span>
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "Others",
        header: "Others",
        cell: ({ getValue }) => (
          <span>
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "Salary1",
        header: "Employee 1",
        cell: ({ getValue }) => (
          <span>
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "Salary2",
        header: "Employee 2",
        cell: ({ getValue }) => (
          <span>
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "DateAdded",
        header: "Date",
        cell: ({ getValue }) => {
          const dateValue = getValue<string>();
          const date = new Date(dateValue);

          if (isNaN(date.getTime())) {
            return <span>-</span>;
          }

          return (
            <div className="flex flex-col gap-1 whitespace-nowrap">
              <span>
                {date
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    timeZone: "Asia/Manila",
                  })
                  .replace(/ /g, "-")
                  .toLowerCase()}
              </span>

              {/* <span className="text-xs text-slate-500">
                {date.toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Manila",
                })}
              </span> */}
            </div>
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total Expense",
        cell: ({ getValue }) => {
          const total = Number(getValue<number>() ?? 0);

          return (
            <span className="font-bold text-amber-800">
              ₱{total.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },

      {
        id: "Actions",
        header: "Actions",
        cell: (info) => {
          const product = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hover:cursor-pointer"
                onClick={() => handlePreview(product)}
              >
                <Eye className="h-4 w-4 text-gray-400 hover:text-amber-700 "></Eye>
              </button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const filteredExpenseHistoryMonthAndYear = useMemo(() => {
    if (!globalFilter) {
      return ExpenseHistory;
    }

    return ExpenseHistory.filter((item) => {
      return getDateKeyMonthAndYear(item.DateAdded).startsWith(
        globalFilter,
      );
    });

    /*

      Above code is being filter using single month and year only

    */
  }, [ExpenseHistory, globalFilter]);

  const totalExpense = useMemo(() => {
  return ExpenseHistory.map((item) => ({
    ...item,
    total:
      Number(item.Ice ?? 0) +
      Number(item.Water ?? 0) +
      Number(item.Electricity ?? 0) +
      Number(item.Rent ?? 0) +
      Number(item.RawMats ?? 0) +
      Number(item.Others ?? 0) +
      Number(item.Salary1 ?? 0) +
      Number(item.Salary2 ?? 0),
  }));
}, [ExpenseHistory]);

  const filteredExpenseHistory = useMemo(() => {
    return totalExpense.filter((item) => {
      const DateAdded = getDateKey(item.DateAdded);

      if (!DateAdded) return false;

      if (appliedDateFrom && DateAdded < appliedDateFrom) {
        return false;
      }

      if (appliedDateTo && DateAdded > appliedDateTo) {
        return false;
      }

      return true;
    });
  }, [totalExpense, appliedDateFrom, appliedDateTo]);


  // TanStack Table
  const table = useReactTable({
     data: filteredExpenseHistory, // para sa new column total expense
    // data: filteredExpenseHistory.map((item) => ({
    //   ...item,
    //   total:
    //     Number(item.Ice ?? 0) +
    //     Number(item.Water ?? 0) +
    //     Number(item.Electricity ?? 0) +
    //     Number(item.Rent ?? 0) +
    //     Number(item.RawMats ?? 0) +
    //     Number(item.Others ?? 0) +
    //     Number(item.Salary1 ?? 0) +
    //     Number(item.Salary2 ?? 0),
    // })),
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
const grandTotalExpense = useMemo(() => {
  return totalExpense.reduce((total, item) => {
    return total + Number(item.total ?? 0);
  }, 0);
}, [totalExpense]);
  const handlePreview = (report: IExpense) => {
    setSelectedItem(report);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  // const [PrevItems, setPrevItems] = useState<ExpenseHistory[]>([]);

  // const viewItems = (product: ExpenseHistory) => {
  //     return [
  //       ...prev,
  //       {
  //         ProductID: product.ProductID,
  //         ProductName: product.ProductName,
  //         Category: product.Category,
  //         Price: product.Price,
  //         Quantity: product.Quantity,
  //         TotalItemPrice: product.TotalItemPrice
  //       },
  //     ];
  //   });
  // };
//   const viewItems = (transaction: IExpense) => {
//     return transaction.Products ?? [];
//   };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Date Filter */}
        <div className="flex flex-row items-center gap-3 w-full sm:max-w-md mb-4">
          {/* <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Filter by Date
        </label> */}

          <div>
            {/* <div className="month-filter-icon">
            <CalendarDays size={18} />
          </div>

          <div className="month-filter-content">
            <label htmlFor="monthFilter">Filter by Month</label>
            <input
              id="monthFilter"
              type="month"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div> */}

            <div className="flex gap-5 items-end">
              <div>
                <p>Filter Date From</p>
                <DatePicker
                  value={filterDateFrom}
                  onChange={setFilterDateFrom}
                />
              </div>
              <div>
                <p>Filter Date To</p>
                <DatePicker value={filterDateTo} onChange={setFilterDateTo} />
              </div>

              {/* <MonthYearPicker
                value={globalFilter}
                onChange={setGlobalFilter}
              /> */}
              <div className="flex gap-5 items-end">
                <button
                type="button"
                className="product-create-button max-h-[40px] "
                onClick={() => {
                  setAppliedDateFrom(filterDateFrom);
                  setAppliedDateTo(filterDateTo);
                }}
              >
                <Settings2 className="w-4 h-4" />
                Filter
              </button>
              <button
                type="button"
                className="product-create-button max-h-[40px]"
                onClick={filterCurrentMonth}
              >
                <Filter className="w-4 h-4" />
                Current Month
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="product-create-button"
              >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
              </div>
              <div className="total-sales-card">
                <div className="total-sales-icon">
                  <Coffee size={22} />
                </div>

                <div className="total-sales-info">
                  <span>Total Expense</span>
                  <h2>₱
                    {grandTotalExpense.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h2>
                  {/* <p>{filteredExpenseHistory.length} transactions</p> */}
                </div>
              </div>
            </div>

            {/* {globalFilter && (
            // <button
            //   type="button"
            //   onClick={() => setGlobalFilter("")}
            //   className="month-filter-clear"
            //   aria-label="Clear month filter"
            //   title="Clear filter"
            // >
              <X size={17} />
            </button>
          )} */}
          </div>
        </div>

        {/* Report Table */}
        <div className="product-table-scroll">
          <table className="product-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-5 py-4 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-gray-900">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-8 text-center text-sm text-gray-400"
                  >
                    Loading Expense...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-8 text-center text-sm text-gray-400"
                  >
                    No Expense for this month.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer transition hover:bg-amber-50/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="whitespace-nowrap px-5 py-4 text-slate-600"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <PreviewExpense
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            expense={selectedItem}
          />

        </div>
      </div>
    </>
  );
};

export default ExpensePage;
