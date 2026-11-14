"use client";

import { ITransaction } from "../../lib/types/cartItems";
import { createTransaction, updateTransaction } from "../../actions/transactions"
import { createTransacItems, createTransacItemsArray } from "./../../actions/transactionItems"
import { useState } from "react";
import "../../src/styles/styles.css"
import {
    X,
    Trash2,
    Banknote,
    Smartphone,
    CheckCircle,
    Plus,
    Percent,
    MoveDiagonal2Icon,
} from "lucide-react";

import type { CartItem, DiscountType } from "../../lib/types/cartItems";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { ITransacItemsSave } from "../../lib/types/cartItems";



type OverallDiscountType = "percentage" | "fixed";
type PaymentMethod = "cash" | "gcash";

interface CheckoutScreenProps {
    cartItems: CartItem[];
    onClose: () => void;
    ITransaction?: ITransaction | null;
    transactionDate?: Date | null;
}

const formatCurrency = (amount: number) =>
    `₱${amount.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function CheckoutScreen({
    cartItems,
    onClose,
    ITransaction,
    transactionDate
}: CheckoutScreenProps) {


    const queryClient = useQueryClient();

    const [itemDiscounts, setItemDiscounts] = useState<
        Record<string, DiscountType>
    >({});

    // Overall discount
    const [overallDiscountType, setOverallDiscountType] =
        useState<OverallDiscountType>("percentage");

    const [overallDiscountValue, setOverallDiscountValue] = useState("0");

    // Payment
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>("cash");

    const [amountReceived, setAmountReceived] = useState("");
    const [message, setMessage] = useState("");

    const getItemDiscountType = (item: CartItem): DiscountType =>
        itemDiscounts[Number(item.ProductID)] ?? "none";

    const getOriginalSubtotal = (item: CartItem) =>
        Number(item.pPrice) * Number(item.quantity);

    const getItemDiscount = (item: CartItem) =>
        getItemDiscountType(item) === "none"
            ? 0
            : getOriginalSubtotal(item) * 0.2;

    const getItemNetSubtotal = (item: CartItem) =>
        getOriginalSubtotal(item) - getItemDiscount(item);

    const subtotal = cartItems.reduce(
        (sum, item) => sum + getOriginalSubtotal(item),
        0
    );

    const totalItemDiscount = cartItems.reduce(
        (sum, item) => sum + getItemDiscount(item),
        0
    );

    const subtotalAfterItemDiscount = Math.max(
        0,
        subtotal - totalItemDiscount
    );

    const discountValue = Math.max(
        0,
        Number(overallDiscountValue) || 0
    );

    const orderDiscount =
        overallDiscountType === "percentage"
            ? subtotalAfterItemDiscount *
            (Math.min(discountValue, 100) / 100)
            : Math.min(discountValue, subtotalAfterItemDiscount);

    const total = Math.max(
        0,
        subtotalAfterItemDiscount - orderDiscount
    );

    const received = Number(amountReceived) || 0;

    const change2 =
        paymentMethod === "cash"
            ? Math.max(0, received - total)
            : 0;

    const change = Math.max(received - total);

    const canProceed =
        cartItems.length > 0 &&
        (paymentMethod === "gcash" || received >= total);

    const updateItemDiscount = (
        item: CartItem,
        discountType: DiscountType
    ) => {
        setItemDiscounts((previous) => ({
            ...previous,
            [Number(item.ProductID)]: discountType,
        }));

        setMessage("");
    };

    const handleDiscountValueChange = (value: string) => {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setOverallDiscountValue(value);
            setMessage("");
        }
    };

    const handleAmountReceivedChange = (value: string) => {
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmountReceived(value);
            setMessage("");
        }
    };

    const addAmount = (amount: number) => {
        setAmountReceived(String((Number(amountReceived) || 0) + amount));
        setMessage("");
    };


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
    
    const handleProceedOrder = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        try {
            //Transaction 
            e.preventDefault();

            if (cartItems.length === 0) {
                setErrorSubmit("Walang item sa order.");
                return;
            }

            if (received < total) {
                setErrorSubmit("Kulang ang amount received.");
                return;
            }

            setIsSubmitting(true);
            setErrorSubmit(null);
            setMessage("");

            const transactionData = new FormData();

            transactionData.set("Payment", String(received));
            transactionData.set("SubTotal", String(subtotal));
            transactionData.set(
                "PaymentMethod",
                paymentMethod === "cash" ? "Cash" : "GCash"
            );
            transactionData.set(
                "DiscountType",
                overallDiscountType === "percentage"
                    ? "Percentage"
                    : "Fixed"
            );
            transactionData.set("Discount", String(orderDiscount));
            transactionData.set(
            "TransactionDate",
            transactionDate ? transactionDate.toISOString() : ""
            );

            
 
            const resTransaction = await createTransaction(transactionData);
            const resTransactionID = resTransaction.TransactionID;
            if (resTransaction.error) {
                setErrorSubmit(resTransaction.error); 
               return;
            }


            await queryClient.invalidateQueries({
                queryKey: ["transactions"],
                refetchType: "none",
            });

            //Transaction Items
            
           const transacItemsData = new FormData();
            const transactionItems: ITransacItemsSave[] = cartItems.map(
              (item) => ({
                TransactionID: Number(resTransactionID),
                ProductID: Number(item.ProductID),
                ProductName: item.pName,
                Category: item.pCode ?? undefined,
                Price: Number(item.pPrice),
                Cost: Number(item.pCost),
                DiscountType:
                  getItemDiscountType(item) === null
                    ? null
                    : getItemDiscountType(item),
                Quantity: Number(item.quantity),
                DateAdded: transactionDate ?? null,
              }),
            );


            const resTransacItems = await createTransacItemsArray(transactionItems);

            onClose();
            if (resTransacItems.error) {
                setErrorSubmit(resTransacItems.error);
                
                return;
            }

        }
        catch (error) {
            setErrorSubmit(
                error instanceof Error
                    ? error.message
                    : "Hindi na-save ang transaction."
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>

            <form onSubmit={handleProceedOrder}>
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Checkout
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Review your order and payment details
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close checkout"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">

                            {/* Order Summary */}
                            <section>
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800">
                                        Order Summary
                                    </h3>

                                    <span className="text-sm text-slate-500">
                                        {cartItems.length} item(s)
                                    </span>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full min-w-[800px] text-sm">
                                        <thead className="bg-slate-50 text-slate-600">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-semibold">
                                                    Item
                                                </th>

                                                <th className="px-4 py-3 text-right font-semibold">
                                                    Price
                                                </th>

                                                <th className="px-4 py-3 text-center font-semibold">
                                                    Qty
                                                </th>

                                                <th className="px-4 py-3 text-left font-semibold">
                                                    Discount Options
                                                </th>

                                                <th className="px-4 py-3 text-right font-semibold">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {cartItems.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-4 py-8 text-center text-slate-500"
                                                    >
                                                        Walang item sa order.
                                                    </td>
                                                </tr>
                                            ) : (
                                                cartItems.map((item, index) => (
                                                    <tr
                                                        key={`${String(item.ProductID)}-${index}`}
                                                        className="hover:bg-slate-50/70"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="font-medium text-slate-800">
                                                                {item.pName}
                                                            </div>

                                                            {item.pCode && (
                                                                <div className="mt-1 text-xs text-slate-500">
                                                                    {item.pCode}
                                                                </div>
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-3 text-right text-slate-600">
                                                            {formatCurrency(Number(item.pPrice))}
                                                        </td>

                                                        <td className="px-4 py-3 text-center text-slate-600">
                                                            {item.quantity}
                                                        </td>

                                                        {/* Per-item discount */}
                                                        <td className="px-4 py-3">
                                                            <select
                                                                value={getItemDiscountType(item)}
                                                                onChange={(event) =>
                                                                    updateItemDiscount(
                                                                        item,
                                                                        event.target.value as DiscountType
                                                                    )
                                                                }
                                                                className="w-full min-w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                            >
                                                                <option value="none">No Discount</option>
                                                                <option value="pwd">PWD - 20%</option>
                                                                <option value="student">Student - 20%</option>
                                                            </select>
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-semibold text-slate-800">
                                                            {formatCurrency(getItemNetSubtotal(item))}

                                                            {getItemDiscount(item) > 0 && (
                                                                <div className="mt-1 text-xs font-normal text-green-700">
                                                                    -{formatCurrency(getItemDiscount(item))}
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Left: Overall discount | Right: Payment */}
                            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">

                                {/* Left side: Overall discount */}
                                <section className="space-y-5 rounded-xl border border-slate-200 p-5">
                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            Discount Settings
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Apply a discount to the entire order.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Overall Discount Type
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOverallDiscountType("percentage");
                                                    setMessage("");
                                                }}
                                                className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${overallDiscountType === "percentage"
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <Percent size={16} className="mr-2 inline" />
                                                Percentage (%)
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOverallDiscountType("fixed");
                                                    setMessage("");
                                                }}
                                                className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${overallDiscountType === "fixed"
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                            >
                                                Fixed Amount (₱)
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="overallDiscount"
                                            className="mb-2 block text-sm font-medium text-slate-700"
                                        >
                                            Discount Value
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="overallDiscount"
                                                type="text"
                                                inputMode="decimal"
                                                value={overallDiscountValue}
                                                onChange={(event) =>
                                                    handleDiscountValueChange(event.target.value)
                                                }
                                                placeholder="Enter discount"
                                                className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                            />

                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                                                {overallDiscountType === "percentage" ? "%" : "₱"}
                                            </span>
                                        </div>

                                        {overallDiscountType === "percentage" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {[5, 10, 15, 20].map((percentage) => (
                                                    <button
                                                        key={percentage}
                                                        type="button"
                                                        onClick={() => {
                                                            setOverallDiscountValue(String(percentage));
                                                            setMessage("");
                                                        }}
                                                        className={`rounded-lg border px-3 py-2 text-sm transition ${Number(overallDiscountValue) === percentage
                                                            ? "border-blue-500 bg-blue-50 font-semibold text-blue-700"
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        {percentage}%
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {overallDiscountType === "fixed" && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {[20, 50, 100, 200].map((amount) => (
                                                    <button
                                                        key={amount}
                                                        type="button"
                                                        onClick={() => {
                                                            setOverallDiscountValue(String(amount));
                                                            setMessage("");
                                                        }}
                                                        className={`rounded-lg border px-3 py-2 text-sm transition ${Number(overallDiscountValue) === amount
                                                            ? "border-blue-500 bg-blue-50 font-semibold text-blue-700"
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                            }`}
                                                    >
                                                        ₱{amount}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="rounded-lg bg-slate-50 p-4">
                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <span>Subtotal after item discounts</span>
                                            <span>
                                                {formatCurrency(subtotalAfterItemDiscount)}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-sm font-medium text-green-700">
                                            <span>Order Discount</span>
                                            <span>-{formatCurrency(orderDiscount)}</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Right side: Payment */}
                                <section className="space-y-5 rounded-xl border border-slate-200 p-5">
                                    <div>
                                        <h3 className="font-bold text-slate-800">
                                            Payment Details
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Select the payment method.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPaymentMethod("cash");
                                                setMessage("");
                                            }}
                                            className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-semibold transition ${paymentMethod === "cash"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            <Banknote size={19} />
                                            Cash
                                            {paymentMethod === "cash" && (
                                                <CheckCircle size={16} className="ml-auto" />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPaymentMethod("gcash");
                                                setMessage("");
                                            }}
                                            className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-semibold transition ${paymentMethod === "gcash"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                        >
                                            <Smartphone size={19} />
                                            GCash
                                            {paymentMethod === "gcash" && (
                                                <CheckCircle size={16} className="ml-auto" />
                                            )}
                                        </button>
                                    </div>

                                    {(
                                        <div>
                                            <label
                                                htmlFor="amountReceived"
                                                className="mb-2 block text-sm font-medium text-slate-700"
                                            >
                                                Amount Received
                                            </label>

                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                                                    ₱
                                                </span>

                                                <input
                                                    id="amountReceived"
                                                    type="text"
                                                    inputMode="decimal"
                                                    value={amountReceived}
                                                    onChange={(event) =>
                                                        handleAmountReceivedChange(event.target.value)
                                                    }
                                                    placeholder="Enter amount received"
                                                    className="w-full rounded-lg border border-slate-300 py-3 pl-9 pr-4 text-lg font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {[50, 100, 200, 500, 1000].map((amount) => (
                                                    <button
                                                        key={amount}
                                                        type="button"
                                                        onClick={() => addAmount(amount)}
                                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                                                    >
                                                        <Plus size={13} className="mr-1 inline" />
                                                        ₱{amount}
                                                    </button>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAmountReceived(total.toFixed(2));
                                                        setMessage("");
                                                    }}
                                                    className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    Exact Amount
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAmountReceived("");
                                                        setMessage("");
                                                    }}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    <Trash2 size={14} className="mr-1 inline" />
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === "cash" && (
                                        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                                            <span className="text-sm font-medium text-slate-600">
                                                Change
                                            </span>

                                            <span
                                                className={`text-xl font-bold ${received >= total
                                                    ? "text-green-600"
                                                    : received < total && received != 0
                                                        ? "text-red-400"
                                                        : "text-slate-400"
                                                    }`}
                                            >
                                                {formatCurrency(change)}
                                            </span>
                                        </div>
                                    )}
                                </section>
                            </div>


                            <div className="rounded-xl border border-slate-200 p-5">
                                <h3 className="mb-4 font-bold text-slate-800">
                                    Order Summary
                                </h3>
                                <section>
                                    <div className="grid grid-cols-2 space-y-3 gap-10">
                                        <div>
                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(subtotal)}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-green-700">
                                                <span>Item Discount</span>
                                                <span>-{formatCurrency(totalItemDiscount)}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-green-700">
                                                <span>Order Discount</span>
                                                <span>-{formatCurrency(orderDiscount)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                                                <span>Total</span>
                                                <span>{formatCurrency(total)}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>Amount Received</span>
                                                <span>{formatCurrency(received)}</span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm font-semibold text-green-700">
                                                <span>Change</span>
                                                <span
                                                    className={`font-bold ${received >= total
                                                        ? "text-green-600"
                                                        : received < total && received != 0
                                                            ? "text-red-400"
                                                            : "text-slate-400"
                                                        }`}
                                                >{formatCurrency(change)}</span>
                                            </div>
                                        </div>
                                    </div>

                                </section>

                                {message && (
                                    <div
                                        role="status"
                                        className={`rounded-lg p-3 text-sm ${message.startsWith("Order ready!")
                                            ? "border border-green-200 bg-green-50 text-green-700"
                                            : "border border-amber-200 bg-amber-50 text-amber-700"
                                            }`}
                                    >
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || cartItems.length === 0 ||  received === 0 ||  change < 0}
                                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Submitting . . . "
                                    : "Proceed Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}