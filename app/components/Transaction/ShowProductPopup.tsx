
"use client";

import { X, ImageOff, ShoppingCart, Plus, Minus } from "lucide-react";
import type { tblProduct } from "../../lib/types/database";
import "./../../src/styles/styles.css"
import { useEffect, useState } from "react";

interface ShowProductPopupProps {
    isOpen: boolean;
    onClose: () => void;
    product: tblProduct | null;
    onAddToCart: (product: tblProduct, quantity: number) => void;
}

const ProductPopup = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
}: ShowProductPopupProps) => {


    const [quantity, setQuantity] = useState(1);

    const handleAdd = () => {
        setQuantity((prev) => prev + 1);
    };


    const handleMinus = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };
    if (!isOpen || !product) return null;


const handleClose = () => {
    setQuantity(1);
    onClose();
};



    // // Function na gusto mong tumakbo tuwing bubukas ang modal
    //   const handleModalOpen = () => {
    //     setQuantity(1);
    //   };

    //   useEffect(() => {
    //     // Kapag ang isOpen ay nag-true (ibig sabihin binuksan ang modal)
    //     if (isOpen) {
    //       handleModalOpen();
    //     }
    //   }, [isOpen]); // <--- Nag-rerun ito tuwing nagbabago ang 'isOpen'


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-md rounded-xl bg-[#efddc5]  p-1 shadow-xl"
                onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex w-full gap-4">
                    <div className="flex w-[30%] h-50 items-center justify-center rounded-lg bg-[#efddc5] p-4">
                        {product.pImg ? (
                            <img
                                src={product.pImg}
                                alt={product.pName}
                                className="h-full w-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <ImageOff className="h-10 w-10" />
                            </div>
                        )}
                    </div>

                    <div className="w-[70%] items-center justify-center rounded-lg bg-[#efddc5] p-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            {product.pName}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Product Code: {product.pCode || "N/A"}
                        </p>

                        <p className="mt-3 text-lg font-bold text-amber-700">
                            Php {Number(product.pPrice ?? 0).toFixed(2)}
                        </p>

                        <div className="mt-4 border-t pt-4">
                            <p className="text-sm text-gray-600">
                                Category: {product.pCategory || "N/A"}
                            </p>

                            <p className="mt-2 text-sm text-gray-600">
                                Availability:{" "}
                                <span
                                    className={
                                        product.pIsActive
                                            ? "font-semibold text-green-600"
                                            : "font-semibold text-red-600"
                                    }
                                >
                                    {product.pIsActive ? "Available" : "Not Available"}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pt-2">
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Quantity
                    </label>

                    <div className="grid grid-cols-[48px_minmax(0,1fr)_48px] h-12 overflow-hidden rounded-lg border border-gray-300 bg-white">
                        <button
                            type="button"
                            onClick={handleMinus}
                            className="flex items-center justify-center hover:bg-gray-100"
                        >
                            <Minus size={18} />
                        </button>

                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Math.max(1, Number(e.target.value) || 1))
                            }
                            className="w-full min-w-0 border-x border-gray-200 bg-white text-center outline-none"
                        />

                        <button
                            type="button"
                            onClick={handleAdd}
                            className="flex items-center justify-center hover:bg-gray-100"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="grid w-full grid-cols-2 gap-3 border-t border-amber-900/10 p-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="!m-0 flex !h-12 !w-full min-w-0 box-border items-center justify-center 
                        rounded-xl border border-gray-300 bg-white px-3 text-base font-semibold text-gray-700 
                        transition hover:bg-gray-100">
                        Close
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                        if (!product || !product.pIsActive) return;

                        onAddToCart(product, quantity);
                        setQuantity(1);
                        onClose();
                        }}
                        disabled={!product.pIsActive}
                        className="!m-0 flex !h-12 !w-full min-w-0 box-border items-center justify-center 
                        gap-2 rounded-xl bg-gray-900 px-2 text-sm font-semibold text-white transition 
                        hover:bg-gray-800 disabled:opacity-50">
                        <ShoppingCart className="h-5 w-5 shrink-0" />
                        <span className="whitespace-nowrap">Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPopup;
