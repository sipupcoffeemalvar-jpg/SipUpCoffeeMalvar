"use client"

import "../src/styles/styles.css"
import "../src/styles/productTable.css"
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  ColumnFilter
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { tblProduct } from "../lib/types/database";
import { getProduct, deleteProduct, getAllProduct } from "../actions/tblProduct";
import { getAllCategory } from "../actions/category";
import {
  Plus, TableProperties, Search, Pencil, Trash, Trash2, ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight,
  Check, X, Coffee, CoffeeIcon, Leaf, LucideCoffee, ImageOff,
  Package,
  CupSoda,
  Blend,
  Croissant,
  Blender,
  ChevronDown
} from "lucide-react";
import { getUsers } from "../actions/users";
import { getStatusBadgetColor } from "../utils/table_helper";
import ProductModal from "../components/common/ProductModal";
import ConfirmModal from "../components/common/ConfirmModal";
// import { Pagination } from "@supabase/supabase-js";
// import { TransformCallback } from "node:stream";
// import { setGlobal } from "next/dist/trace";
// import { headers } from "next/headers";

const ProductTable = () => {
  //console.log("PRODUCT TABLE RENDER");
  //   console.log(
  //   "SUPABASE URL:",
  //   process.env.NEXT_PUBLIC_SUPABASE_URL
  // );

  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState(""); //Global search
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  //Model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<tblProduct | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<tblProduct | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const result = await getAllProduct();
         
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    }
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

  // type CategoryOption = {
  //   CategoryID: string;
  //   cCode: string;
  //   cDescription: string | null;
  // };


  //const [categories, setCategories] = useState<CategoryOption[]>([]);

  //Modal ata to?

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    }
  });


  //Delete users
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  //function handlers
  const handleCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleteError(null);
    const result = await deleteMutation.mutateAsync(productToDelete.ProductID);
    if (result.error)
      setDeleteError(result.error);
    else {
      setIsConfirmModalOpen(false);
      setProductToDelete(null)
    }
  }

  const handleCloseConfirmModal = () => {
    if (!deleteMutation.isPending) {
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
    }
  }
  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    setDeleteError(null);
  }

  const handleEdit = (product: tblProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  const handleDelete = (product: tblProduct) => {
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  }


  //Convert ID to name
  const getUserDisplay = (userId: string | null): string => {
    if (!userId) return "-";
    const user = users?.find((u) => u.id === userId);
    if (!user) return userId;
    return `${user.name} (${user.email})`;
  }


  //table columns
  const columns = useMemo<ColumnDef<tblProduct>[]>(
    () => [
      {
        accessorKey: "pImg",
        header: "Image",
        cell: (info) => {
          const image = info.getValue() as string | null;

          return (
            <div>
              {image ? (
                <img
                  src={image}
                  alt="Product"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <ImageOff className="h-5 w-5 text-red-300" />
                // <span className="text-gray-400">No Image</span>
              )}
            </div>
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

          const categoryText = category?.cDescription ?? categoryCode;

          return (
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgetColor(categoryCode)
                }`}
            >
              {categoryText}
            </span>
          );
        },
      },
      {
        accessorKey: "pPrice",
        header: "Price",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "pCost",
        header: "Cost",
        cell: (info) => {
          return (
            <div className="flex items-center justify-center">
              {info.getValue() as string}
            </div>
          );
        },
      },
      {
        accessorKey: "sales",
        header: "Sales",
        cell: ({ row }) => {

          const price = Number(row.original.pPrice ?? 0);
          const cost = Number(row.original.pCost ?? 0);
          const sales = price - cost;
      
          return (
            <div className="flex items-center justify-center">
              {sales.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: "pIsActive",
        header: "Is Available",
        cell: (info) => {
          const isAvailable = info.getValue<boolean>();

          return (
            <div className="flex items-center justify-center">
              {isAvailable ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <X className="h-5 w-5 text-red-600" />
              )}
            </div>
          );
        },
      },
      {
        id: "Actions",
        header: "Actions",
        cell: (info) => {
          const product = info.row.original;
          return <div className="flex items-center gap-2">
            <button type="button" className="hover:cursor-pointer" onClick={() => handleEdit(product)}>
              <Pencil className="h-4 w-4 text-gray-400 hover:text-amber-700"></Pencil>
            </button>
            <button type="button" className="hover:cursor-pointer" onClick={() => handleDelete(product)}>
              <Trash2 className="h-4 w-4 text-red-400 hover:text-amber-700"></Trash2>
            </button>
          </div>
        }
      }
    ],
    [deleteMutation.isPending]
  );

  const table = useReactTable({
    data: products || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString", //para tumama ang search filter keyword pag wala default filter ang gagamitin ni tanstack
    onPaginationChange: setPagination,
    autoResetPageIndex: false, // para hindi mag reset pag ng sort sa header
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination
    }

  })


  if (isLoading) {
    return (<div className="flex items-center justify-center p-8">
      <div className="text-gray-400">Loading task . . . </div>
    </div>
    );
  }

  if (error) {
    return <div className="rounded-lg p-4 bg-red-900/20 text-red-400">
      Error loading task: {error instanceof Error ? error.message : "Unknown Eror"}
    </div>
  }


  return (
    <>
      <div className="product-page">
        <div className="product-header">
          <div className="product-heading">
            <h1>Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your inventory, ingredients, and product assignments.</p>
          </div>
          <div className="mb-4 items-center justify-between flex">
            <button
              type="button"
              onClick={handleCreate}
              className="product-create-button"
            >
              <Plus className="w-4 h-4" />
              Create Product
            </button>
          </div>
        </div>
        <div className="product-summary-grid">
          <div className="product-summary-card">
            <div className="product-summary-icon bg-red-50 text-red-600">
              <Package className="w-4 h-4" />
            </div>
            <div className="product-summary-content">
              <p className="product-summary-label">Total Products</p>
              <p className="product-summary-count">{products.filter(p => p.pCategory !== "AO").length}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-blue-50 text-blue-500">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="product-summary-content">
              <p className="product-summary-label">Iced Coffee at hot</p>
              <p className="product-summary-count">{products.filter(p => p.pCategory === "IC").length}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[#E3DDD3] text-[#756858]">
              <CupSoda className="w-4 h-4" />
            </div>
            <div className="product-summary-content">
              <p className="product-summary-label">Non Coffee</p>
              <p className="product-summary-count">{products.filter(p => p.pCategory === "NC").length}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[whitesmoke] text-[gray]">
              <Blender className="w-4 h-4" />
            </div>
            <div className="product-summary-content">
              <p className="product-summary-label">Frappe</p>
              <p className="product-summary-count">{products.filter(p => p.pCategory === "FR").length}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-emerald-50 text-emerald-600">
              <Leaf className="w-4 h-4" />
            </div>
            <div className="product-summary-content">
              <p className="product-summary-label">Matcha Series</p>
              <p className="product-summary-count">{products.filter(p => p.pCategory === "MT").length}</p>
            </div>
          </div>

          <div className="product-summary-card">
            <div className="product-summary-icon bg-[#F0E2CF] text-[#997B59]">
              <Croissant className="w-4 h-4" />
            </div>
            <div className="product-summary-content">
              <p className="product-summary-label">Pastry</p>
              <p className="product-summary-count">{products.filter(p => p.pCategory === "P").length}</p>
            </div>
          </div>
        </div>

        <div className="custom-border">
          <div className="product-filter-panel">
            <div className="product-filter-toolbar">
              {/* Search - Left Side */}
              <div className="product-search">
                <Search className="product-search-icon" size={17} />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="product-search-input"
                />

                {globalFilter && (
                  <button
                    type="button"
                    onClick={() => setGlobalFilter("")}
                    className="product-search-clear"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category - Right Side */}
              <div className="product-filter-right">
                <div className="product-category-wrapper">

                  <div className="product-category-wrapper">
                    <select
                      id="statusFilter"
                      value={categoryFilter}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCategoryFilter(value);

                        setColumnFilters((prev) => {
                          const filters = prev.filter(
                            (filter) => filter.id !== "pCategory"
                          );

                          return value === "ALL"
                            ? filters
                            : [...filters, { id: "pCategory", value }];
                        });
                      }}
                      className="product-category-select"
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

                    <ChevronDown className="product-category-icon" size={16} />
                  </div>

                  <i className="fa-solid fa-chevron-down product-category-icon" />
                </div>
              </div>

              {/* Counter - Pinakakanan */}
              <span className="product-counter">
                Showing{" "}
                <strong>{table.getFilteredRowModel().rows.length}</strong>
                {" "}of {table.getCoreRowModel().rows.length} products
              </span>
            </div>
          </div>


          <div className="product-table-scroll">
            <table className="product-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="header-cell"
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
                              header.getContext()
                            )}

                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-900 ">
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
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="table-cell">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="product-table-pagination">
            <div className="product-page-size">
              <span className="text-sm text-gray-700">Row per page</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(e.target.value),
                  });
                }}
                className="rounded-lg border hover:cursor-pointer px-2 py-1 text-sm bg-gray-400 text-white focus:border-white focus:ring-white">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="product-page-number">
                Page {table.getState().pagination.pageIndex + 1} of {" "} {table.getPageCount()} </span>
              <div className="product-pagination-controls">
                <button className="rounded-lg border p-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-700 bg-gray-800
              text-gray-300 hover:bg-gray-700" disabled={!table.getCanPreviousPage()}
                  onClick={() => table.setPageIndex(0)}>
                  <ChevronsLeft className="h-2 w-4 text-gray-400"></ChevronsLeft>
                </button>

                <button className="rounded-lg border p-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-700 bg-gray-800
              text-gray-300 hover:bg-gray-700" disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}>
                  <ChevronLeft className="h-2 w-4 text-gray-400"></ChevronLeft>
                </button>

                <button className="rounded-lg border p-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-700 bg-gray-800
              text-gray-300 hover:bg-gray-700" disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}>
                  <ChevronRight className="h-2 w-4 text-gray-400"></ChevronRight>
                </button>

                <button className="rounded-lg border p-1 disabled:cursor-not-allowed disabled:opacity-50 border-gray-700 bg-gray-800
              text-gray-300 hover:bg-gray-700" disabled={!table.getCanNextPage()}
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                  <ChevronsRight className="h-2 w-4 text-gray-400"></ChevronsRight>
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct} />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmDelete}
        title="Title"
        error={deleteError}
        message={
          productToDelete ? `Are you you want to delete ${productToDelete?.pName} ` :
            `Are you sure you want to delete this product`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
        isConfirm={true} />
    </>
  )
}

export default ProductTable;