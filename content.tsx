"use client";

import "../src/styles/styles.css";
import "../src/styles/productTable.css";

import MonthYearPicker from "../components/common/MonthYear";

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

import { useState } from "react";

// ==========================================
// TYPES
// ==========================================

type ProductSales = {
  code: string;
  name: string;
  category: string;
  cups: number;
  sales: number;
  discount: number;
  cost: number;
};

type WeeklySales = {
  day: string;
  sales: number;
};

// ==========================================
// UNIFIED PRODUCT DATA
// ==========================================

const productSalesData: ProductSales[] = [
  {
    code: "IC001",
    name: "Spanish Latte",
    category: "Iced Coffee",
    cups: 185,
    sales: 22200,
    discount: 200,
    cost: 7500,
  },
  {
    code: "IC002",
    name: "Caramel Macchiato",
    category: "Iced Coffee",
    cups: 152,
    sales: 19000,
    discount: 150,
    cost: 6500,
  },
  {
    code: "MT001",
    name: "Matcha Latte",
    category: "Matcha",
    cups: 128,
    sales: 16384,
    discount: 100,
    cost: 5500,
  },
  {
    code: "FR001",
    name: "Oreo Frappe",
    category: "Frappe",
    cups: 105,
    sales: 14175,
    discount: 125,
    cost: 4800,
  },
  {
    code: "NC001",
    name: "Strawberry Milk",
    category: "Non-Coffee",
    cups: 92,
    sales: 10120,
    discount: 75,
    cost: 3500,
  },
];

// ==========================================
// WEEKLY SALES DATA
// ==========================================

const weeklySalesData: WeeklySales[] = [
  { day: "Mon", sales: 5200 },
  { day: "Tue", sales: 3800 },
  { day: "Wed", sales: 6500 },
  { day: "Thu", sales: 4700 },
  { day: "Fri", sales: 8200 },
  { day: "Sat", sales: 10500 },
  { day: "Sun", sales: 7800 },
];

// ==========================================
// CATEGORY COLORS
// ==========================================

const categoryColors: Record<string, string> = {
  "Iced Coffee": "#856548",
  Matcha: "#A78B70",
  Frappe: "#C5A989",
  "Non-Coffee": "#DCCBB7",
  Pastry: "#E9DED1",
};

// ==========================================
// FORMAT CURRENCY
// ==========================================

const formatCurrency = (amount: number) =>
  `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ==========================================
// COMPONENT
// ==========================================

export default function ContentPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();

    return `${today.getFullYear()}-${String(
      today.getMonth() + 1,
    ).padStart(2, "0")}`;
  });

  // ==========================================
  // TOP 5 PRODUCTS
  // ==========================================

  const topProducts = [...productSalesData]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // ==========================================
  // SALES BY CATEGORY
  // ==========================================

  const categoryTotals = productSalesData.reduce(
    (acc, product) => {
      acc[product.category] =
        (acc[product.category] || 0) + product.sales;

      return acc;
    },
    {} as Record<string, number>,
  );

  const totalCategorySales = Object.values(categoryTotals).reduce(
    (total, sales) => total + sales,
    0,
  );

  const categories = Object.entries(categoryTotals).map(
    ([name, sales]) => ({
      name,
      sales,
      percent:
        totalCategorySales > 0
          ? Number(
              ((sales / totalCategorySales) * 100).toFixed(1),
            )
          : 0,
      color: categoryColors[name] || "#E9DED1",
    }),
  );

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

  const slices = categories.map((category) => {
    const startAngle = currentAngle;
    const endAngle =
      currentAngle + (category.sales / totalCategorySales) * 360;

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
  // WEEKLY SALES GRAPH
  // ==========================================

  const maxSales =
    Math.ceil(
      Math.max(...weeklySalesData.map((item) => item.sales)) / 1000,
    ) * 1000;

  const yAxisLabels = Array.from(
    { length: 6 },
    (_, index) => maxSales - (maxSales / 5) * index,
  );

  return (
    <>
      <div className="m-4">
        {/* ================================== */}
        {/* MONTH FILTER */}
        {/* ================================== */}

        <div className="mb-4">
          <MonthYearPicker
            value={selectedMonth}
            onChange={setSelectedMonth}
          />
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
              <p className="product-summary-count">₱10,000.00</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-red-50 text-red-600 !rounded-full">
              <Package className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Discount</p>
              <p className="product-summary-count">₱500.00</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-blue-50 text-blue-500 !rounded-full">
              <Coffee className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Cost</p>
              <p className="product-summary-count">₱3,000.00</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[#E3DDD3] text-[#756858] !rounded-full">
              <CupSoda className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Expense</p>
              <p className="product-summary-count">₱1,500.00</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[whitesmoke] text-[gray] !rounded-full">
              <Blender className="w-4 h-4" />
            </div>

            <div className="product-summary-content">
              <p className="product-summary-label">Net Profit</p>
              <p className="product-summary-count">₱5,000.00</p>
            </div>
          </div>
        </div>

        {/* ================================== */}
        {/* TOP 5 + WEEKLY SALES GRAPH */}
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
                <span className="text-right">Net Sales</span>
              </div>

              {/* PRODUCT ROWS */}

              <div className="divide-y divide-slate-100">
                {topProducts.map((product, index) => (
                  <div
                    key={product.code}
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
                        {product.name}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {product.code} · {product.cups} cups sold
                      </p>
                    </div>

                    {/* NET SALES */}

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800 tabular-nums">
                        {formatCurrency(product.sales)}
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
          {/* WEEKLY SALES GRAPH */}
          {/* ================================== */}

          <div className="lg:col-span-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombined className="w-4 h-4 text-[#856548]" />

                  <h3 className="text-sm font-semibold text-slate-800">
                    Weekly Sales
                  </h3>
                </div>

                <p className="text-xs text-slate-400 mt-1">
                  Weekly sales performance
                </p>
              </div>

              <span className="text-xs bg-[#F5EEE7] text-[#856548] px-3 py-1.5 rounded-lg">
                {selectedMonth}
              </span>
            </div>

            <div className="h-[260px] w-full flex">
              {/* Y AXIS */}

              <div className="flex flex-col justify-between text-[10px] text-slate-400 pr-3 pb-6">
                {yAxisLabels.map((value, index) => (
                  <span key={index}>
                    {value === 0
                      ? "₱0"
                      : `₱${(value / 1000).toFixed(0)}k`}
                  </span>
                ))}
              </div>

              {/* CHART */}

              <div className="relative flex-1 flex flex-col">
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

                <div className="relative z-10 flex flex-1 items-end justify-around gap-3 pb-6">
                  {weeklySalesData.map((item) => (
                    <div
                      key={item.day}
                      className="group relative flex h-full flex-1 flex-col justify-end items-center"
                    >
                      {/* TOOLTIP */}

                      <div
                        className="absolute hidden group-hover:block z-20 rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white whitespace-nowrap -translate-y-2"
                        style={{
                          bottom: `${(item.sales / maxSales) * 100}%`,
                        }}
                      >
                        {formatCurrency(item.sales)}
                      </div>

                      {/* BAR */}

                      <div
                        className="w-full max-w-10 rounded-t-md bg-[#A78B70] transition-all duration-300 hover:bg-[#856548] cursor-pointer"
                        style={{
                          height: `${(item.sales / maxSales) * 100}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* X AXIS */}

                <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                  {weeklySalesData.map((item) => (
                    <span
                      key={item.day}
                      className="flex-1 text-center text-[10px] text-slate-400"
                    >
                      {item.day}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* LEGEND */}

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#A78B70]" />

              <span className="text-xs text-slate-500">
                Weekly Sales
              </span>
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
                  {productSalesData.map((product) => {
                    const profit =
                      product.sales -
                      product.discount -
                      product.cost;

                    return (
                      <tr
                        key={product.code}
                        className="border-b border-slate-100 hover:bg-[#FAF8F5]"
                      >
                        <td className="px-3 py-3 font-medium text-slate-700">
                          <div>{product.name}</div>
                          <span className="text-[11px] text-slate-400">
                            {product.code}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-right text-slate-600">
                          {product.cups}
                        </td>

                        <td className="px-3 py-3 text-right text-slate-700">
                          {formatCurrency(product.sales)}
                        </td>

                        <td className="px-3 py-3 text-right text-slate-500">
                          {formatCurrency(product.discount)}
                        </td>

                        <td className="px-3 py-3 text-right text-slate-500">
                          {formatCurrency(product.cost)}
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
                      {productSalesData.reduce(
                        (total, item) => total + item.cups,
                        0,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatCurrency(
                        productSalesData.reduce(
                          (total, item) => total + item.sales,
                          0,
                        ),
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatCurrency(
                        productSalesData.reduce(
                          (total, item) => total + item.discount,
                          0,
                        ),
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {formatCurrency(
                        productSalesData.reduce(
                          (total, item) => total + item.cost,
                          0,
                        ),
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-emerald-700">
                      {formatCurrency(
                        productSalesData.reduce(
                          (total, item) =>
                            total +
                            item.sales -
                            item.discount -
                            item.cost,
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
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full"
                >
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