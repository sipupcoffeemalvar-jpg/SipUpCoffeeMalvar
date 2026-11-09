"use client";

import "../src/styles/styles.css";
import "../src/styles/productTable.css";
import PreviewReport from "../components/Report/PreviewReport";
import PageHeader from "../components/common/PageHeader";
import type { IExpense } from "../lib/types/expense";
import { getAllExpense } from "../actions/expense";
import { totalExpenseByDate } from "../hooks/totalExpenseByDate";

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
  SlidersHorizontal,
  ListFilter,
  Settings2,
  SlidersVertical,
} from "lucide-react";

import type { ReportHistory } from "../lib/types/Reports";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import { ReportTableGroupItems } from "../actions/report";
import MonthYearPicker from "../components/common/MonthYear";
import DatePicker from "../components/common/DatePicker";

// Convert TransactionDate into YYYY-MM-DD
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

const ReportPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReportHistory | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");

  // const [globalFilter, setGlobalFilter] = useState(() => {
  //   const today = new Date();

  //   return new Intl.DateTimeFormat("en-CA", {
  //     timeZone: "Asia/Manila",
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   }).format(today);
  // });

  const filterCurrentMonth = () => {
    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

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
        const result = await ReportTableGroupItems();

        if (!isMounted) return;

        if (!result.error && result.TransacData) {
          setReportHistory(result.TransacData);
        } else if (result.error) {
          console.error("Report error:", result.error);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
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
  const columns = useMemo<ColumnDef<ReportHistory>[]>(
    () => [
      {
        id: "Transaction",
        header: "Transaction Details",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-slate-700">
              {row.original.CustomID}
            </span>

            <span className="text-xs text-slate-500">
              {row.original.Products?.length ?? 0} items
            </span>
          </div>
        ),
      },
      {
        accessorKey: "PaymentMethod",
        header: "Payment Method",
      },
      {
        accessorKey: "Payment",
        header: "Payment",
        cell: ({ getValue }) => (
          <span className="font-semibold text-amber-800">
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      // {
      //   accessorKey: "SubTotal",
      //   header: "Total",
      //   cell: ({ getValue }) => <span>₱{Number(getValue()).toFixed(2)}</span>,
      // },
      {
        accessorKey: "Discount",
        header: "Discount",
        cell: ({ getValue }) => <span>₱{Number(getValue()).toFixed(2)}</span>,
      },
      {
        accessorKey: "Change",
        header: "Change",
        cell: ({ getValue }) => <span>₱{Number(getValue()).toFixed(2)}</span>,
      },
      {
        accessorKey: "SubTotal",
        header: "Total Amount",
        cell: ({ getValue }) => (
          <span className="font-semibold text-slate-700">
            ₱{Number(getValue()).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "TransactionDate",
        header: "Date & Time",
        cell: ({ getValue }) => {
          const dateValue = getValue<string>();
          const date = new Date(dateValue);

          if (isNaN(date.getTime())) {
            return <span>-</span>;
          }

          return (
            <div className="flex flex-col gap-1 whitespace-nowrap">
              <span className="font-semibold text-slate-700">
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

              <span className="text-xs text-slate-500">
                {date.toLocaleTimeString("en-PH", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Manila",
                })}
              </span>
            </div>
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

  // Filter transactions by selected date
  // const filteredReportHistory = useMemo(() => {
  //   if (!globalFilter) {
  //     return reportHistory;
  //   }

  //   return reportHistory.filter((item) => {
  //     // return getDateKeyMonthAndYear(item.TransactionDate) === globalFilter;
  //     // Kunin ang YYYY-MM

  //     const dateKey = getDateKeyMonthAndYear(item.TransactionDate);
  //     return dateKey.substring(0, 7) === globalFilter;
  //   });
  // }, [reportHistory, globalFilter]);

  const filteredReportHistoryMonthAndYear = useMemo(() => {
    if (!globalFilter) {
      return reportHistory;
    }

    return reportHistory.filter((item) => {
      return getDateKeyMonthAndYear(item.TransactionDate).startsWith(
        globalFilter,
      );
    });

    /*

      Above code is being filter using single month and year only

    */
  }, [reportHistory, globalFilter]);

  const filteredReportHistory = useMemo(() => {
    return reportHistory.filter((item) => {
      const transactionDate = getDateKey(item.TransactionDate);

      if (!transactionDate) return false;

      if (appliedDateFrom && transactionDate < appliedDateFrom) {
        return false;
      }

      if (appliedDateTo && transactionDate > appliedDateTo) {
        return false;
      }

      return true;
    });
  }, [reportHistory, appliedDateFrom, appliedDateTo]);

  const totalSellingPrice = useMemo(() => {
    return filteredReportHistory.reduce((total, item) => {
      // Mali: last record lang ang kinukuha
      //return Number(item.SubTotal || 0);
      
      //console.error(item.ProductName + ' ' + item.SubTotal);

      // Tama: ina-add lahat ng records
      return total + Number(item.SubTotal || 0);
    }, 0);
  }, [filteredReportHistory]);

  

  const totalCups = useMemo(() => {
    return filteredReportHistory.reduce((total, item) => {
      return total + Number(item.Quantity || 0);
    }, 0);
  }, [filteredReportHistory]);
  // const totalCostPrice = useMemo(() => {
  //   return filteredReportHistory.reduce((total, item) => {
  //     return total + Number(item.Cost || 0);
  //   }, 0);
  // }, [filteredReportHistory]);

  const totalCostPrice = useMemo(() => {
    return filteredReportHistory.reduce((total, transaction) => {
      const productCost = transaction.Products.reduce(
        (productTotal, product) => {
          return (
            productTotal +
            Number(product.Cost ?? 0) * Number(product.Quantity ?? 0)
          );
        },
        0,
      );

      return total + productCost;
    }, 0);
  }, [filteredReportHistory]);

  // TanStack Table
  const table = useReactTable({
    data: filteredReportHistory,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePreview = (report: ReportHistory) => {
    setSelectedItem(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  // const [PrevItems, setPrevItems] = useState<ReportHistory[]>([]);

  // const viewItems = (product: ReportHistory) => {
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
  const viewItems = (transaction: ReportHistory) => {
    return transaction.Products ?? [];
  };
  // const [ExpenseHistory, setExpenseHistory] = useState<IExpense[]>([]);

  // const totalExpense = useMemo(() => {
  //   return ExpenseHistory.map((item) => ({
  //     ...item,
  //     total:
  //       Number(item.Ice ?? 0) +
  //       Number(item.Water ?? 0) +
  //       Number(item.Electricity ?? 0) +
  //       Number(item.Rent ?? 0) +
  //       Number(item.RawMats ?? 0) +
  //       Number(item.Others ?? 0) +
  //       Number(item.Salary1 ?? 0) +
  //       Number(item.Salary2 ?? 0),
  //   }));
  // }, [ExpenseHistory]);

  // const filteredExpenseHistory = useMemo(() => {
  //   return totalExpense.filter((item) => {
  //     const DateAdded = getDateKey(item.DateAdded);

  //     if (!DateAdded) return false;

  //     if (appliedDateFrom && DateAdded < appliedDateFrom) {
  //       return false;
  //     }

  //     if (appliedDateTo && DateAdded > appliedDateTo) {
  //       return false;
  //     }

  //     return true;
  //   });
  // }, [totalExpense, appliedDateFrom, appliedDateTo]);

  // // Fetch report data
  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchReport = async () => {
  //     try {
  //       const result = await getAllExpense();

  //       if (result.error) {
  //         throw new Error(result.error);
  //       }

  //       if (isMounted) {
  //         setExpenseHistory(result.data ?? []);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch Expense:", error);
  //     } finally {
  //       if (isMounted) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   fetchReport();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  // const grandTotalExpense = useMemo(() => {
  //   return filteredExpenseHistory.reduce((total, item) => {
  //     return total + Number(item.total ?? 0);
  //   }, 0);
  // }, [filteredExpenseHistory]);


  // =======================
  //  Separate ts for expense record
  // =======================
  const {
    grandTotalExpense
  } = totalExpenseByDate(appliedDateFrom, appliedDateTo);

  const grossProfit = totalSellingPrice - totalCostPrice;

  const netProfit = grossProfit - grandTotalExpense;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Date Filter */}
        <div className="mb-4">
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
              </div>
              <div className="total-sales-card ml-auto">
                {/* <div className="total-sales-icon">
                  <Coffee size={22} />
                </div> */}

                <div className="total-sales-info w-full ">
                  <div className="flex justify-between items-center w-full gap-8">
                    <div>
                      <span>Selling Price</span>
                      <h2>
                        ₱
                        {totalSellingPrice.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h2>
                    </div>
                    <div className="text-center">
                      <span>Cost</span>
                      <h2>
                        ₱
                        {totalCostPrice.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h2>
                    </div>
                    <div className="text-center">
                      <span className="!text-amber-800">Expense</span>
                      <h2 className="!text-amber-800">
                        ₱
                        {grandTotalExpense.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h2>
                    </div>
                    <div className="text-center">
                      <span className="!text-green-800">Net Profit</span>
                      <h2 className="!text-green-800">
                        ₱
                        {netProfit.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </h2>
                    </div>
                    <div className="text-center hidden">
                      <span className="!text-green-800">Total Cups</span>
                      <h2 className="!text-green-800">
                        ₱
                        {totalCups}
                      </h2>
                    </div>
                  </div>

                  {/* <p>{filteredReportHistory.length} transactions</p> */}
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
                    Loading reports...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-8 text-center text-sm text-gray-400"
                  >
                    No transactions found.
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

          <PreviewReport
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            items={selectedItem}
          />
        </div>
      </div>
    </>
  );
};

export default ReportPage;
