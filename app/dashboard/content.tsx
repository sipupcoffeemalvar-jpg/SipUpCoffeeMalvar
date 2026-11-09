"use client";

import "../src/styles/styles.css";
import "../src/styles/productTable.css";

import MonthYearPicker from "../components/common/MonthYear";
import { PieCategoryColors } from "../utils/table_helper";

import { useMemo, useState } from "react";
import { GetItemByCategory, GetReportDailySales } from "../actions/report";

import { IDailySales } from "../lib/types/Reports";

import {
  Coffee,
  Package,
  CupSoda,
  Blender,
  Trophy,
  TrendingUp,
  Medal,
  ArrowUpRight,
  ChartNoAxesCombined,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { totalExpenseByDate } from "../hooks/totalExpenseByDate";

// type IWeeklySales = {
//   day: string;
//   sales: number;
// };
const formatCurrency = (amount: number) =>
  `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ==========================================
// Format Date
// ==========================================
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
    //day: "2-digit",
  }).format(date);
};

export default function ContentPage() {
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo] = useState("");


  // MONTH AND YEAR FILTER
  const [globalFilter, setGlobalFilter] = useState(() => {
    const today = new Date();

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
    }).format(today);

  });

  const {
    data: reportByCategoryData = [],
  } = useQuery({
    queryKey: ["reportCategory"],
    queryFn: async () => {
      const result = await GetItemByCategory();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.reportByCategoryData ?? [];
    },
  });
// NEW: Format Date for YYYY-MM

  // FILTER CATEGORY DATA By Date
  const monthlyReportData = useMemo(() => {
    if (!globalFilter) {
      return reportByCategoryData;
    }
    

    return reportByCategoryData.filter((item) => {
      const dateKey = getDateKeyMonthAndYear(item.DateAdded);

      // console.log({
      //   databaseDate: item.DateAdded,
      //   dateKey,
      //   selectedMonth: globalFilter,
      // });

      // Kapag Clear / All months
      if (!globalFilter) return true;

      return dateKey === globalFilter;
    });
  }, [reportByCategoryData, globalFilter]);

  // ==========================================
  // Calculate total
  // ==========================================
  const TotalNetSales = monthlyReportData.reduce(
    (total, item) => total + item.TotalSales,
    0,
  );
  
  const TotalCups = useMemo(() => {
    return monthlyReportData.reduce((total, item) => {
      return total + Number(item.TotalCups ?? 0);
    }, 0);
  }, [monthlyReportData]);
  
  
  const TotalCostItem = useMemo(() => {
    return monthlyReportData.reduce((total, item) => {
      return total + Number(item.TotalCost ?? 0);
    }, 0);
  }, [monthlyReportData]);

  const TotalDiscount = useMemo(() => {
    return monthlyReportData.reduce((total, item) => {
      const discountRate = ["pwd", "student"].includes(
        String(item.DiscountType ?? "").toLowerCase(),
      )
        ? 0.2
        : 0;

      const price = Number(item.Price ?? 0);
      const quantity = Number(item.Quantity ?? 0);

      const discountAmount = price * quantity * discountRate;

      return total + discountAmount;
    }, 0);
  }, [monthlyReportData]);

  
  // =======================
  //  Separate ts for expense record
  // =======================
  
  const handleMonthChange = (value: string) => {
    setGlobalFilter(value);

  if (!value) {
    setAppliedDateFrom("");
    setAppliedDateTo("");
    return;
  }

  const [year, month] = value.split("-").map(Number);

  const from = `${year}-${String(month).padStart(2, "0")}-01`;

  const lastDay = new Date(year, month, 0).getDate();

  const to = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  setAppliedDateFrom(from);
  setAppliedDateTo(to);
  };

  const { grandTotalExpense } = totalExpenseByDate(
    appliedDateFrom,
    appliedDateTo,
  );
  
  const TotalNetProfit = TotalNetSales - TotalCostItem - TotalDiscount - grandTotalExpense;

  // ==========================================
  // TOP 5 PRODUCTS
  // ==========================================

  const topProducts = useMemo(() => {

    return [...monthlyReportData]
      //.sort((a, b) => b.TotalSales - a.TotalSales)
      .sort((a, b) => b.TotalCups - a.TotalCups)
      .slice(0, 5);
  }, [monthlyReportData]);

  // ==========================================
  // SALES BY CATEGORY
  // ==========================================

  const categoryTotals = monthlyReportData.reduce<Record<string, number>>(
    (acc, product) => {
      const category = product.cDescription;
      const sales = Number(product.TotalSales ?? 0);

      acc[category] = (acc[category] ?? 0) + sales;

      return acc;
    },
    {} as Record<string, number>
  );

  const totalCategorySales = Object.values(categoryTotals).reduce(
    (total, sales) => total + sales,
    0,
  );

  const categories = Object.entries(categoryTotals).map(([name, sales]) => ({
    name,
    sales,
    percent:
      totalCategorySales > 0
        ? Number(((sales / totalCategorySales) * 100).toFixed(1))
        : 0,
    color: PieCategoryColors(name) || "#E9DED1",
  }));

  // ==========================================
  // PIE CHART COMPUTATION
  // ==========================================

  let currentAngle = 0;

  const polarToCartesian = (angle: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;

    return {
      x: 100 + 85 * Math.cos(radians),
      y: 100 + 85 * Math.sin(radians),
    };
  };
  //let currentAngle = -90;

  const slices = categories.map((category) => {
    const sales = Number(category.sales ?? 0);

    const startAngle = currentAngle;

    const endAngle =
      totalCategorySales > 0
        ? currentAngle + (sales / totalCategorySales) * 360
        : currentAngle;

    currentAngle = endAngle;

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return {
      ...category,
      path: [
        "M 100 100",
        `L ${start.x} ${start.y}`,
        `A 85 85 0 ${largeArc} 1 ${end.x} ${end.y}`,
        "Z",
      ].join(" "),
    };
  });

  

// ==========================================
// Daily SALES DATA
// ==========================================

// const weeklySalesData: IWeeklySales[] = [
//   { day: "Mon", sales: 5200 },
// ];

// // const weeklySalesData: IDailySales[] = useMemo(() => {
// const dailySalesData: IDailySales[] = useMemo(() => {
// console.table(reportByCategoryData);
//   const startDate = new Date("2026-11-01T00:00:00");
//   const endDate = new Date("2026-11-08T00:00:00");

//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   return days.map((dayName, index) => {
//     const sales = reportByCategoryData
//       .filter((item) => {
//         const date = new Date(item.DateAdded);

//         return (
//           date >= startDate &&
//           date < endDate &&
//           date.getDay() === index
//         );
//       })
//       .reduce(
//         (total, item) =>
//           total +
//           Number(item.Price ?? 0) * Number(item.Quantity ?? 0),
//         0,
//       );

//     return {
//       day: dayName,
//       sales,
//     };
//   });
// }, [reportByCategoryData]);

// const weeklySalesData1stWeek: IDailySales[] = useMemo(() => {
//   const today = new Date();

//   const monday = new Date(today);
//   const day = (today.getDay() + 6) % 7;
//   monday.setDate(today.getDate() - day);
//   monday.setHours(0, 0, 0, 0);

//   const sunday = new Date(monday);
//   sunday.setDate(monday.getDate() + 7);

//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//   return days.map((dayName, index) => {
//     const sales = reportByCategoryData
//       .filter((item) => {
//         const date = new Date(item.DateAdded);

//         return (
//           date >= monday &&
//           date < sunday &&
//           (date.getDay() + 6) % 7 === index
//         );
//       })
//       .reduce(
//         (total, item) =>
//           total + Number(item.Price ?? 0) * Number(item.Quantity ?? 0),
//         0,
//       );

//     return {
//       day: dayName,
//       sales,
//     };
//   });
// }, [reportByCategoryData]);


  // ==========================================
  // WEEKLY SALES GRAPH
  // ==========================================

  // const maxSales =
  //   Math.ceil(Math.max(...weeklySalesData.map((item) => item.sales)) / 1000) *
  //   1000;

  // const yAxisLabels = Array.from(
  //   { length: 6 },
  //   (_, index) => maxSales - (maxSales / 5) * index,
  // );


  // ==============================
  // Sales Daily Report
  // ==============================
//   interface IDailySales {
//   day_number: number;
//   day: string;
//   sales: number;
// }

const {
  data: reportDailySales = [],
  isLoading: isDailySalesLoading,
  error: dailySalesError,
} = useQuery<IDailySales[]>({
  queryKey: ["reportDailySales", globalFilter],
  queryFn: async () => {
    console.log("Selected Month:", globalFilter);

    const result = await GetReportDailySales(globalFilter);

    console.log("Daily Sales Result:", result);
    console.log("Daily Sales Data:", result.reportDailySales);

    if (result.error) {
      throw new Error(result.error);
    }

    return result.reportDailySales ?? [];
  },
  enabled: !!globalFilter,
});

    const maxSales = Math.max(
  ...reportDailySales.map((item) => Number(item.sales ?? 0)),
  1
);

  const yAxisLabels = Array.from(
  { length: 5 },
  (_, index) => (maxSales / 4) * (4 - index)
);

  return (
    <>
    {/* <div className="mb-3 text-xs">
      <p>Selected Month: {globalFilter}</p>
      <p>Loading: {String(isDailySalesLoading)}</p>
      <p>Records: {reportDailySales.length}</p>

      {dailySalesError && (
        <p className="text-red-500">
          Error: {dailySalesError.message}
        </p>
      )}
    </div> */}
      <div className="m-4">
        {/* ================================== */}
        {/* MONTH FILTER */}
        {/* ================================== */}

        <div className="mb-4">
          <MonthYearPicker value={globalFilter} onChange={handleMonthChange} />
        </div>

        {/* ================================== */}
        {/* SUMMARY CARDS */}
        {/* ================================== */}

        <div className="product-summary-grid">
          <div className="product-summary-card">
            <div className="product-summary-icon bg-red-50 text-red-600 !rounded-full">
              <Package className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Net Income</p>
              <p className="product-summary-count">{formatCurrency(TotalNetSales)}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-red-50 text-red-600 !rounded-full">
              <Package className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Discount</p>
              <p className="product-summary-count">{formatCurrency(TotalDiscount)}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-blue-50 text-blue-500 !rounded-full">
              <Coffee className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Cost</p>
              <p className="product-summary-count">{formatCurrency(TotalCostItem)}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[#E3DDD3] text-[#756858] !rounded-full">
              <CupSoda className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Expense</p>
              <p className="product-summary-count">{grandTotalExpense}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[whitesmoke] text-[gray] !rounded-full">
              <Blender className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Net Profit</p>
              <p className="product-summary-count">{formatCurrency(TotalNetProfit)}</p>
            </div>
          </div>

            <div className="product-summary-card">
              <div className="product-summary-icon bg-[whitesmoke] text-[gray] !rounded-full">
                <Coffee className="w-4 h-4" />
              </div>

              <div className="product-summary-content">
                <p className="product-summary-label">Total Cups</p>
                <p className="product-summary-count">{TotalCups}</p>
              </div>
            </div>
        </div>

        {/* ================================== */}
        {/* TOP 5 + Daily SALES GRAPH */}
        {/* ================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-6 mt-5 rounded-xl border bg-white shadow-sm border-[#eadfd4] overflow-hidden">
          {/* ================================== */}
          {/* TOP 5 PRODUCTS */}
          {/* ================================== */}

          <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-[#eadfd4]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#eadfd4]">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#A47B4E]" />

                  <h3 className="font-semibold text-slate-800 text-sm">
                    Top 5 Products
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Best selling products this month
                </p>
              </div>

              <span className="text-xs font-semibold text-[#856548] bg-[#F5EEE7] px-2.5 py-1 rounded-full">
                Monthly
              </span>
            </div>

            <div className="px-5 py-3">
              {/* COLUMN HEADER */}

              <div className="grid grid-cols-[36px_minmax(0,1fr)_auto] gap-2 pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>Rank</span>
                <span>Product</span>
                <span className="text-right">Cups</span>
              </div>

              {/* PRODUCT ROWS */}

              <div className="divide-y divide-slate-100">
                {topProducts.map((product, index) => (
                  <div
                    key={product.Category}
                    className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-2 py-3"
                  >
                    {/* RANKING */}

                    <div className="flex items-center justify-center">
                      {index === 0 ? (
                        <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#FFF2D9] text-[#B88635]">
                          <Medal size={17} />
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {product.ProductName}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {product.Category} · {formatCurrency(product.TotalSales)}
                      </p>
                    </div>

                    {/* NET SALES */}

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800 tabular-nums">
                        {/* {product.TotalCups} cups sold */}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FOOTER */}

            <div className="px-5 py-3 bg-[#FAF8F5] border-t border-[#eadfd4]">
              <div className="flex items-center gap-2 text-xs text-[#856548]">
                <TrendingUp size={15} />
                <span>Ranked by highest net sales</span>
              </div>
            </div>
          </div>

          {/* ================================== */}
          {/* Daily SALES GRAPH */}
          {/* ================================== */}

          <div className="lg:col-span-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombined className="w-4 h-4 text-[#856548]" />

                  <h3 className="text-sm font-semibold text-slate-800">
                    Daily Sales
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Daily sales performance
                </p>
              </div>

              <span className="text-xs bg-[#F5EEE7] text-[#856548] px-3 py-1.5 rounded-lg">
                {globalFilter}
              </span>
            </div>

            <div className="h-[260px] w-full flex">
  {/* Y AXIS */}
  <div className="flex flex-col justify-between text-[10px] text-slate-400 pr-3 pb-6">
    {yAxisLabels.map((value, index) => (
      <span key={index}>
        {value === 0
          ? "₱0"
          : `₱${(value / 1000).toFixed(1)}k`}
      </span>
    ))}
  </div>

  {/* CHART */}
  <div className="relative flex-1 flex flex-col min-w-0">
    {/* GRID LINES */}
    <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
      {yAxisLabels.map((_, index) => (
        <div
          key={index}
          className="w-full border-t border-dashed border-slate-200"
        />
      ))}
    </div>

    {/* BARS */}
    <div className="relative z-10 flex flex-1 items-end justify-around gap-[2px] sm:gap-1 pb-6">
      {reportDailySales.map((item) => {
  const sales = Number(item.sales ?? 0);

  return (
    <div
      key={item.day_number}
      className="group relative flex h-full flex-1 flex-col justify-end items-center min-w-0"
    >
      <div
        className="absolute hidden group-hover:block z-20 rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white whitespace-nowrap -translate-y-2"
        style={{
          bottom: `${(sales / maxSales) * 100}%`,
        }}
      >
        {item.day}: {formatCurrency(sales)}
      </div>

      <div
        className="w-full max-w-8 rounded-t-sm bg-[#A78B70] transition-all duration-300 hover:bg-[#856548] cursor-pointer"
        style={{
          height: `${(sales / maxSales) * 100}%`,
          minHeight: sales > 0 ? "2px" : "0px",
        }}
      />
    </div>
  );
})}
    </div>

    {/* X AXIS */}
    <div className="absolute bottom-0 left-0 right-0 flex justify-around">
      {reportDailySales.map((item) => (
        <span
          key={item.day_number}
          className="flex-1 text-center text-[9px] text-slate-400"
        >
          {item.day_number}
        </span>
      ))}
    </div>
  </div>
</div>

            {/* LEGEND */}

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#A78B70]" />

              <span className="text-xs text-slate-500">Daily Sales</span>
            </div>
          </div>
        </div>

        {/* ================================== */}
        {/* SALES DETAILS + CATEGORY */}
        {/* ================================== */}

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-6 gap-5">
          {/* ================================== */}
          {/* SALES DETAILS */}
          {/* ================================== */}

          <div className="lg:col-span-4 rounded-xl border border-[#eadfd4] bg-white shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800">
              Sales Details
            </h3>

            <p className="text-xs text-slate-400 mt-1 mb-4">
              Item performance summary
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="text-left px-3 py-3">Item</th>
                    <th className="text-right px-3 py-3">Sold</th>
                    <th className="text-right px-3 py-3">Sales</th>
                    <th className="text-right px-3 py-3">Discount</th>
                    <th className="text-right px-3 py-3">Cost</th>
                    <th className="text-right px-3 py-3">Profit</th>
                  </tr>
                </thead>

                <tbody>
                  {monthlyReportData.map((product) => {
                    const profit =
                      product.TotalSales -
                      // product.discount -
                      product.TotalCost;

                    return (
                      <tr
                        key={product.Category}
                        className="border-b border-slate-100 hover:bg-[#FAF8F5]"
                      >
                        <td className="px-3 py-3 font-medium text-slate-700">
                          <div>{product.ProductName}</div>
                          <span className="text-[11px] text-slate-400">
                            {product.cCode}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-right text-slate-600">
                          {product.TotalCups}
                        </td>

                        <td className="px-3 py-3 text-right text-slate-700">
                          {formatCurrency(product.TotalSales)}
                        </td>

                        <td className="px-3 py-3 text-right text-slate-500">
                          {/* {formatCurrency(product.discount)} */}
                        </td>

                        <td className="px-3 py-3 text-right text-slate-500">
                          {formatCurrency(product.TotalCost)}
                        </td>

                        <td className="px-3 py-3 text-right font-semibold text-emerald-700">
                          {formatCurrency(profit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* TOTAL ROW */}

                <tfoot className="bg-[#FAF8F5] font-semibold text-slate-700">
                  <tr>
                    <td className="px-3 py-3">Total</td>

                    <td className="px-3 py-3 text-right">
                      {monthlyReportData.reduce(
                        (total, item) => total + item.TotalCups,
                        0,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatCurrency(
                        monthlyReportData.reduce(
                          (total, item) => total + item.TotalSales,
                          0,
                        ),
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatCurrency(
                        monthlyReportData.reduce(
                          (total, item) => total, //+ item.discount,
                          0,
                        ),
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatCurrency(
                        monthlyReportData.reduce(
                          (total, item) => total + item.TotalCost,
                          0,
                        ),
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-emerald-700">
                      {formatCurrency(
                        monthlyReportData.reduce(
                          (total, item) =>
                            total +
                            item.TotalSales -
                            //item.discount -
                            item.TotalCost,
                          0,
                        ),
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ================================== */}
          {/* SALES BY CATEGORY - PIE CHART */}
          {/* ================================== */}

          <div className="lg:col-span-2 rounded-xl border border-[#eadfd4] bg-white shadow-sm p-5">
            <div className="flex items-center gap-2">
              <ArrowUpRight size={17} className="text-[#856548]" />

              <h3 className="text-sm font-semibold text-slate-800">
                Sales by Category
              </h3>
            </div>

            <p className="text-xs text-slate-400 mt-1 mb-5">
              Category performance
            </p>

            <div className="flex flex-col items-center">
              {/* PIE CHART */}

              <div className="relative w-full max-w-[210px] aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {slices.map((slice) => (
                    <path
                      key={slice.name}
                      d={slice.path}
                      fill={slice.color}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200 hover:opacity-75"
                    >
                      <title>
                        {slice.name}: {slice.percent}%
                      </title>
                    </path>
                  ))}

                  <circle
                    cx="100"
                    cy="100"
                    r="48"
                    fill="white"
                    className="pointer-events-none"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400">
                    Total Categories
                  </span>

                  <span className="text-2xl font-bold text-slate-800">
                    {categories.length}
                  </span>
                </div>
              </div>

              {/* LEGEND */}

              <div className="w-full mt-5 space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{
                          backgroundColor: category.color,
                        }}
                      />

                      <span className="text-xs font-medium text-slate-600 truncate">
                        {category.name}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-700 tabular-nums">
                      {category.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
