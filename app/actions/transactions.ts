"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";
import type { DiscountType, PaymentMethod, ITransaction, ITransactionInsert, ITransactionUpdate } from "../lib/types/cartItems";


export const getAllTransaction = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tblTransaction")
        .select("*")
        .order("TransactionDate", { ascending: false });


    if (error) {
        return {
            error: error.message,
            data: null,
        };
    }

    return {
        error: null,
        data,
    };
};


export const getTransaction = async (TransactionID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data, error } = await supabase.from("tblTransaction")
        .select("*")
        .eq("TransactionID", TransactionID)
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
};


export const createTransaction = async (formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    } 
    
    const TransactionData: ITransactionInsert = {
        Payment: (formData.get("Payment") as string),
        SubTotal: (formData.get("SubTotal") as string),
        PaymentMethod: (formData.get("PaymentMethod") as PaymentMethod) || "Cash",
        DiscountType: (formData.get("DiscountType") as DiscountType) || "Fixed",
        Discount: formData.get("Discount") as string,
        CreatedBy: (formData.get("CreatedBy") as string) || null,
    }

    if (!TransactionData.Payment || TransactionData.Payment.trim() === "") {
        return { error: "Transaction name is required" };
    }

    // Return ID after save ng record,
    //Data, return TransactionID and select
    const { data, error } = await supabase
        .from("tblTransaction")
        .insert({
            ...TransactionData,
            CreatedBy: user.id,
        })
        .select("TransactionID")
        .single();
 
    if (error) { 
        return { error: error.message };
    }

    revalidatePath("/Transaction");
    return { error: null,
    TransactionID: data.TransactionID, };
}


export const updateTransaction = async (TransactionID: number, formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblTransaction, error: fetchError } = await supabase.from("tblTransaction")
        .select("CreatedBy, pAssignedTo")
        .eq("TransactionID", TransactionID)
        .single();

    if (fetchError || !tblTransaction) {
        return { error: "Transaction not found!" };
    }

    const canEdit = tblTransaction.CreatedBy === user.id || tblTransaction.pAssignedTo === user.id;

    if (!canEdit) {
        return { error: "You do not have permission!" };
    }

    const updateTransaction: ITransactionUpdate = {};

    const Payment = (formData.get("Payment") as string);
    const SubTotal = (formData.get("SubTotal") as string);
    const PaymentMethod = (formData.get("PaymentMethod") as PaymentMethod);
    const DiscountType = (formData.get("DiscountType") as DiscountType);
    const Discount = formData.get("Discount") as string;
    const CreatedBy = (formData.get("CreatedBy") as string);
    

    if (Payment) updateTransaction.Payment = Payment;
    if (SubTotal) updateTransaction.SubTotal = SubTotal;
    if (PaymentMethod) updateTransaction.PaymentMethod = PaymentMethod;
    if (DiscountType) updateTransaction.DiscountType = DiscountType;
    if (Discount) updateTransaction.Discount = Discount;
    if (CreatedBy) updateTransaction.CreatedBy = CreatedBy;
    
    const { error } = await supabase
        .from("tblTransaction")
        .update(updateTransaction)
        .eq("TransactionID", TransactionID);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Transaction");
    return { error: null };
}

export const deleteTransaction = async (TransactionID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblTransaction, error: fetchError } = await supabase.from("tblTransaction")
        .select("CreatedBy")
        .eq("TransactionID", TransactionID)
        .single();

    if (fetchError || !tblTransaction) {
        return { error: "Transaction not found!" };
    }

    const canDelete = tblTransaction.CreatedBy === user.id;

    if (tblTransaction.CreatedBy !== user.id) {
        return { error: "Only creator can delete" };
    }

    const { error } = await supabase.from("tblTransaction")
        .delete()
        .eq("TransactionID", TransactionID);

    revalidatePath("/Transaction");
    return { error: null };
}