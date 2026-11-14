"use client";

import "../src/styles/styles.css";
import "../src/styles/POS.css";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Check,
  X,
  ImageOff,
} from "lucide-react";

import Link from "next/link";
import type { tblProduct } from "../lib/types/database";
import type { CartItem } from "../lib/types/cartItems";
import DatePicker from "../components/common/DatePicker";

import { deleteProduct, getAllProduct } from "../actions/tblProduct";
import { getAllCategory } from "./../actions/category";
import { getUsers } from "../actions/users";
import { getStatusBadgetColor } from "../utils/table_helper";

import ProductPopup from "../components/Transaction/ShowProductPopup";
import CheckoutScreen from "../components/Transaction/ShowCheckoutPopup";

const ProductTable = () => {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1000,
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<tblProduct | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<tblProduct | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const result = await getAllProduct();

      if (result.error) throw new Error(result.error);

      return result.data ?? [];
    },
  });

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getAllCategory();

      if (result.error) throw new Error(result.error);

      return result.data ?? [];
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();

      if (result.error) throw new Error(result.error);

      return result.data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: tblProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product: tblProduct) => {
    setDeleteError(null);
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setDeleteError(null);

    try {
      const result = await deleteMutation.mutateAsync(
        productToDelete.ProductID
      );

      if (result.error) {
        setDeleteError(result.error);
        return;
      }

      setIsConfirmModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete product."
      );
    }
  };

  const handleCloseConfirmModal = () => {
    if (deleteMutation.isPending) return;

    setIsConfirmModalOpen(false);
    setProductToDelete(null);
    setDeleteError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const showProductPopup = (product: tblProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const columns = useMemo<ColumnDef<tblProduct>[]>(
    () => [
      {
        accessorKey: "pImg",
        header: "Image",
        cell: (info) => {
          const image = info.getValue() as string | null;

          return image ? (
            <img
              src={image}
              alt="Product"
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          );
        },
      },
      {
        accessorKey: "pName",
        header: "Product Name",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-slate-900">
              {row.original.pName}
            </span>
            <span className="text-xs text-slate-500">
              {row.original.pCode}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "pCategory",
        header: "Category",
        cell: (info) => {
          const categoryCode = info.getValue() as string;
          const category = categories.find(
            (item) => item.cCode === categoryCode
          );

          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgetColor(categoryCode)}`}
            >
              {category?.cDescription ?? categoryCode}
            </span>
          );
        },
      },
      {
        accessorKey: "pPrice",
        header: "Price",
        cell: (info) => (
          <div className="flex items-center justify-center">
            {info.getValue() as string}
          </div>
        ),
      },
      {
        accessorKey: "pIsActive",
        header: "Is Available",
        cell: (info) => (
          <div className="flex items-center justify-center">
            {info.getValue<boolean>() ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
        ),
      },
      {
        id: "Actions",
        header: "Actions",
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;

          return (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(product)}
                aria-label="Edit product"
              >
                <Pencil className="h-4 w-4 text-gray-400 hover:text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => handleDelete(product)}
                aria-label="Delete product"
              >
                <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
              </button>
            </div>
          );
        },
      },
    ],
    [categories]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  const addToCart = (product: tblProduct, quantity: number) => {
    if (!product.pIsActive || quantity < 1) return;

    const price = Number(product.pPrice ?? 0);
    const cost = Number(product.pCost ?? 0);

    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.ProductID === product.ProductID
      );

      if (existing) {
        return prev.map((item) => {
          if (item.ProductID !== product.ProductID) return item;

          const newQuantity = item.quantity + quantity;

          return {
            ...item,
            quantity: newQuantity,
            subtotal: newQuantity * item.pPrice,
          };
        });
      }

      return [
        ...prev,
        {
          ProductID: product.ProductID,
          pName: product.pName,
          pCode: product.pCode ?? null,
          pPrice: price,
          quantity,
          subtotal: price * quantity,
          pCost: Number(product.pCost ?? 0),
        },
      ];
    });
  };

  const updateCartQuantity = (
    productId: CartItem["ProductID"],
    quantity: number
  ) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.ProductID === productId
          ? {
            ...item,
            quantity,
            subtotal: item.pPrice * quantity,
          }
          : item
      )
    );
  };

  const removeFromCart = (productId: CartItem["ProductID"]) => {
    setCartItems((prev) =>
      prev.filter((item) => item.ProductID !== productId)
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const clearCart = () => setCartItems([]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
        Error loading products: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="product-table-container relative w-full min-w-0 overflow-visible rounded-bl-lg rounded-br-lg bg-white pt-3 shadow shadow-dashboard">
        {/* HEADER */}
        <div className="product-table-header mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="flex">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-bold text-xl text-slate-900 group"
            ><ChevronLeft className="w-4 h-4"></ChevronLeft>POS System</Link>
            {/* <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Point Of Sale
            </h1> */}
            </div>

            <p className="mt-0.5 text-sm text-slate-500">
              Manage your inventory, ingredients, and product assignments.
            </p>
          </div>

          <DatePicker
          value={transactionDate}
          onChange={setTransactionDate} />
        </div>

        {/* MAIN LAYOUT */}
        <div className="product-table-layout mb-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-10">
          {/* CART */}
          <div className="product-cart custom-border flex min-h-0 flex-col self-start lg:sticky lg:top-20 lg:col-span-3">
            <div className="border-b border-slate-200 bg-slate-50/50 p-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Cart Items
              </h2>
            </div>

            <div className="product-cart-content min-h-0 flex-1 overflow-y-auto p-3">
              {cartItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  No items in cart
                </p>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.ProductID}
                      className="border-b border-slate-200 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-700">
                            {item.pCost}
                          </p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-700">
                            {item.pName}
                          </p>

                          <p className="text-sm text-gray-500">
                            ₱{item.pPrice.toFixed(2)}
                          </p>
                        </div>

                        <p className="whitespace-nowrap font-semibold text-gray-700">
                          ₱{item.subtotal.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                removeFromCart(item.ProductID);
                              } else {
                                updateCartQuantity(
                                  item.ProductID,
                                  item.quantity - 1
                                );
                              }
                            }}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-gray-700 hover:bg-slate-100"
                            aria-label={`Decrease ${item.pName} quantity`}
                          >
                            −
                          </button>

                          <span className="min-w-6 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.ProductID,
                                item.quantity + 1
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white text-lg text-gray-700 hover:bg-slate-100"
                            aria-label={`Increase ${item.pName} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.ProductID)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CART TOTAL */}
              <div className="mt-4 border-slate-200 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-700">Total</span>

                  <span className="text-xl font-bold text-gray-800">
                    ₱{cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                    className="flex-1 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear Cart
                  </button>

                  <button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={() => setIsCheckoutOpen(true)}
                    className="flex-1 rounded-lg border border-green-200 bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="product-list-section custom-border min-w-0 lg:col-span-7">
            <div className="mb-4 min-w-0">
              {/* SEARCH AND FILTER */}
              <div className="product-list-toolbar flex flex-col justify-between gap-4 border-b border-slate-200 bg-slate-50/50 
                pb-2 pl-4 pr-4 
                sm:flex-row sm:items-center">
                <div className="relative w-full min-w-0 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    aria-label="Search products"
                    className="input-field !w-full !pl-8 !pr-8"
                    placeholder="Search Product..."
                  />

                  {globalFilter && (
                    <button
                      type="button"
                      onClick={() => setGlobalFilter("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                  <select
                    id="statusFilter"
                    value={categoryFilter}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCategoryFilter(value);

                      setColumnFilters((prev) => {
                        const remaining = prev.filter(
                          (f) => f.id !== "pCategory"
                        );

                        return value === "ALL"
                          ? remaining
                          : [...remaining, { id: "pCategory", value }];
                      });
                    }}
                    className="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 sm:w-auto"
                  >
                    <option value="ALL">All Categories</option>

                    {categories.map((category) => (
                      <option
                        key={category.CategoryID}
                        value={category.cCode}
                      >
                        {category.cDescription}
                      </option>
                    ))}
                  </select>

                  <span className="hidden whitespace-nowrap rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500">
                    Showing{" "}
                    <strong>
                      {table.getFilteredRowModel().rows.length}
                    </strong>{" "}
                    of <strong>{data.length}</strong> products
                  </span>
                </div>
              </div>

              {categoriesError && (
                <p className="p-3 text-sm text-red-500">
                  Failed to load categories.
                </p>
              )}

              {isLoadingCategories && (
                <p className="p-3 text-sm text-gray-500">
                  Loading categories...
                </p>
              )}

              {/* RESPONSIVE PRODUCT GRID */}
              <div className="w-full min-w-0 p-2 sm:p-3">
                <div className="product-list-grid grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4">
                  {table.getRowModel().rows.map((row) => {
                    const product = row.original;

                    return (
                      <button
                        type="button"
                        onClick={() => showProductPopup(product)}
                        key={product.ProductID}
                        className="product-card min-w-0 overflow-hidden rounded-lg border border-[#c99595] bg-[#efddc5] text-center transition hover:shadow-md"
                      >
                        <div className="product-card-image flex h-24 items-center justify-center p-2 sm:h-32 lg:h-36">
                          {product.pImg ? (
                            <img
                              src={product.pImg}
                              alt={product.pName}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                              <ImageOff className="h-5 w-5 text-red-300" />
                            </div>
                          )}
                        </div>

                        <div className="product-card-details px-2 pb-3">
                          <p className="product-card-name line-clamp-2 break-words text-sm font-medium text-gray-700 sm:text-base">
                            {product.pName}
                          </p>

                          <p className="product-card-price mt-1 text-sm text-gray-700 sm:text-base">
                            Php {Number(product.pPrice ?? 0).toFixed(2)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PAGINATION */}
              <div className="mt-4 hidden flex-col justify-between gap-4 pb-4 sm:flex sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows per page</span>

                  <select
                    value={pagination.pageSize}
                    onChange={(e) =>
                      setPagination({
                        pageIndex: 0,
                        pageSize: Number(e.target.value),
                      })
                    }
                    className="cursor-pointer rounded-lg border bg-gray-100 px-2 py-1 text-sm text-gray-800"
                  >
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="mr-2 text-sm text-gray-700">
                    Page{" "}
                    {table.getPageCount() === 0
                      ? 0
                      : pagination.pageIndex + 1}{" "}
                    of {table.getPageCount()}
                  </span>

                  <button
                    type="button"
                    aria-label="First page"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.setPageIndex(0)}
                    className="rounded-lg border p-1 disabled:opacity-50"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Previous page"
                    disabled={!table.getCanPreviousPage()}
                    onClick={() => table.previousPage()}
                    className="rounded-lg border p-1 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Next page"
                    disabled={!table.getCanNextPage()}
                    onClick={() => table.nextPage()}
                    className="rounded-lg border p-1 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Last page"
                    disabled={!table.getCanNextPage()}
                    onClick={() =>
                      table.setPageIndex(
                        Math.max(0, table.getPageCount() - 1)
                      )
                    }
                    className="rounded-lg border p-1 disabled:opacity-50"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductPopup
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onAddToCart={addToCart}
        />

        {isCheckoutOpen && (
          <CheckoutScreen
            cartItems={cartItems}
            onClose={() => {
              setCartItems([]);
              setIsCheckoutOpen(false);
            }}
            transactionDate={new Date(transactionDate)}
          />
        )}
      </div>
    </>
  );
};

export default ProductTable;