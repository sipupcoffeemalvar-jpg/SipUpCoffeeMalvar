"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "./../lib/supabase/server";
import type { ITransacItems, ITransacItemsSave, ITransacItemsUpdate } from "../lib/types/cartItems";


export const getAllTransacItems = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tblTransactionItems")
        .select("*")
        .order("TransactionID", { ascending: false });


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


export const getTransac = async (TransactionItemsID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data, error } = await supabase.from("tblTransaction")
        .select("*")
        .eq("TransactionItemsID", TransactionItemsID)
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
};


export const createTransacItems = async (formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }


    

    const TransacData: ITransacItemsSave = {
        TransactionID: Number(formData.get("TransactionID") || 0),
        ProductID:  Number(formData.get("TransaProductIDctionID") || 0),
        ProductName: (formData.get("ProductName") as string),
        Category: (formData.get("Category") as string),
        Price:  Number(formData.get("Price") || 0),
        Cost:  Number(formData.get("Cost") || 0),
        DiscountType: (formData.get("DiscountType") as string) || null,
        Quantity:  Number(formData.get("Quantity") || 0),
    }

    if (!TransacData.TransactionID || TransacData.TransactionID === 0) {
        return { error: "Transaction ID is required" };
    }

    const { error } = await supabase
        .from("tblTransaction")
        .insert({
            ...TransacData,
            CreatedBy: user.id,
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Transaction");
    return { error: null };
}

export const createTransacItemsArray = async (
    transactionItems: ITransacItemsSave[]
) => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access" };
    }

    const { error } = await supabase
        .from("tblTransactionItems")
        .insert(
            transactionItems.map((item) => ({
                ...item,
                CreatedBy: user.id
            }))
        );
        
    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Transaction");

    return { error: null };
};


export const updateTransacItems = async (TransactionItemsID: string, formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblTransactionItems, error: fetchError } = await supabase.from("tblTransactionItems")
        .select("CreatedBy, pAssignedTo")
        .eq("TransactionItemsID", TransactionItemsID)
        .single();

    if (fetchError || !tblTransactionItems) {
        return { error: "Transaction not found!" };
    }

    const canEdit = tblTransactionItems.CreatedBy === user.id || tblTransactionItems.pAssignedTo === user.id;

    if (!canEdit) {
        return { error: "You do not have permission!" };
    }

    // TransactionID and ProductID is required sa ITransactItems
    const updateTransactItems: ITransacItemsUpdate = {
        TransactionID: Number(formData.get("TransactionID") || 0),
        ProductID:  Number(formData.get("ProductID") || 0),
    };
    
    const ProductName = (formData.get("ProductName") as string);
    const Category = (formData.get("Category") as string);
    const Price =  Number(formData.get("Price") || 0);
    const Cost =  Number(formData.get("COst") || 0);
    const DiscountType = (formData.get("DiscountType") as string) || null;
    const Quantity =  Number(formData.get("Quantity") || 0);
    

    
    if (ProductName) updateTransactItems.ProductName = ProductName;
    if (Category) updateTransactItems.Category = Category;
    if (Price) updateTransactItems.Price = Price;
    if (Cost) updateTransactItems.Cost = Cost;
    if (DiscountType) updateTransactItems.DiscountType = DiscountType;
    if (Quantity) updateTransactItems.Quantity = Quantity;
    
    const { error } = await supabase
        .from("tblTransactionItems")
        .update(updateTransactItems)
        .eq("TransactionItemsID", TransactionItemsID);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Transaction");
    return { error: null };
}

export const deleteTransaction = async (TransactionItemsID: string) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblTransactionItems, error: fetchError } = await supabase.from("tblTransactionItems")
        .select("CreatedBy")
        .eq("TransactionItemsID", TransactionItemsID)
        .single();

    if (fetchError || !tblTransactionItems) {
        return { error: "Transaction not found!" };
    }

    const canDelete = tblTransactionItems.CreatedBy === user.id;

    if (tblTransactionItems.CreatedBy !== user.id) {
        return { error: "Only creator can delete" };
    }

    const { error } = await supabase.from("tblTransactionItems")
        .delete()
        .eq("TransactionItemsID", TransactionItemsID);

    revalidatePath("/Transaction");
    return { error: null };
}