"use client";

import { X, ShoppingCart } from "lucide-react";
import type { ReportHistory } from "../../lib/types/Reports";
import "../../src/styles/styles.css";
import "../../src/styles/productTable.css";

interface ShowReportItems {
  isOpen: boolean;
  onClose: () => void;
  items: ReportHistory | null;
}

const PreviewReport = ({ isOpen, onClose, items }: ShowReportItems) => {
  if (!isOpen || !items) return null;

  const products = items.Products ?? [];

  const formatCurrency = (amount: number) =>
    `₱${Number(amount ?? 0).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              <span className="italic text-sm">Transaction ID:</span> {items.CustomID}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Transaction Information */}
        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 px-5 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Payment</p>
            <p className="font-semibold text-slate-700">
              {formatCurrency(items.Payment)}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Discount</p>
            <p className="font-semibold text-slate-700">{items.Discount}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Total Amount</p>
            <p className="font-semibold text-amber-800">
              {formatCurrency(items.SubTotal)}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <ShoppingCart size={18} className="text-amber-700" />
            <h3 className="font-semibold text-slate-800">
              Purchased Items ({products.length})
            </h3>
          </div>

          <div className="max-h-72 overflow-y-auto overflow-x-hidden rounded-lg border border-gray-200">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-center font-semibold">Item</th>

                  <th className="px-4 py-3 text-center font-semibold">Price</th>

                  <th className="px-4 py-3 text-center font-semibold">Qty</th>

                  <th className="px-4 py-3 text-center font-semibold">
                    Discount Options
                  </th>

                  <th className="px-4 py-3 text-center font-semibold">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-gray-400"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={`${product.ProductID}-${index}`}
                      className="transition hover:bg-amber-50/40"
                    >
                      <td className="px-5 py-3 font-medium text-slate-700">
                        {product.ProductName}
                      </td>

                      <td className="px-5 py-3 text-center text-slate-600">
                        {formatCurrency(product.Price)}
                      </td>

                      <td className="px-5 py-3 text-center text-slate-600">
                        {product.Quantity}
                      </td>
                      <td className="px-5 py-3 text-center text-slate-600">
                        {product.Cost}
                        {/* {product.ItemDiscount?.toUpperCase() == "NONE" ? "" : product.ItemDiscount} */}
                      </td>

                      <td className="px-5 py-3 text-center font-semibold text-slate-700">
                        {formatCurrency(product.TotalItemPrice)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-amber-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewReport;
