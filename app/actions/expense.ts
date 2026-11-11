"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "./../lib/supabase/server";
import type { IExpense, IExpenseCreate, IExpenseUpdate } from "../lib/types/expense";




export const getAllExpense = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tblExpense")
        .select("*")
        .order("ExpenseID", { ascending: true });


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


export const getExpenseByID = async (ExpenseID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data, error } = await supabase.from("tblExpense")
        .select("*")
        .eq("ExpenseID", ExpenseID)
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
};

export const createExpense = async (formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const ExpenseData: IExpenseCreate = {
        Ice:  Number(formData.get("Ice") || 0),
        Water: Number(formData.get("Water") || 0),
        Electricity: Number(formData.get("Electricity") || 0),
        Rent:  Number(formData.get("Rent") || 0),
        RawMats: Number(formData.get("RawMats") || 0),
        Others:  Number(formData.get("Others") || 0),
        Salary1:  Number(formData.get("Salary1") || 0),
        Salary2:  Number(formData.get("Salary2") || 0),
        Others_Desc: (formData.get("Others_Desc") as string) || null,
    }

    const { error } = await supabase
        .from("tblExpense")
        .insert({
            ...ExpenseData,
            CreatedBy: user.id,
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Expense");
    return { error: null };
}



export const updateExpense = async (ExpenseID: number, formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblExpense, error: fetchError } = await supabase.from("tblExpense")
        .select("CreatedBy")
        .eq("ExpenseID", ExpenseID)
        .single();

    if (fetchError || !tblExpense) {
        return { error: "Expense not found!" };
    }

    const canEdit = tblExpense.CreatedBy === user.id;

    if (!canEdit) {
        return { error: "You do not have permission!" };
    }

    const updateExpense: IExpense = {
        Ice: Number(formData.get("Ice") || 0),
        Water: Number(formData.get("Water") || 0),
        Electricity: Number(formData.get("Electricity") || 0),
        Rent: Number(formData.get("Rent") || 0),
        RawMats: Number(formData.get("RawMats") || 0),
        Others: Number(formData.get("Others") || 0),
        Salary1: Number(formData.get("Salary1") || 0),
        Salary2: Number(formData.get("Salary2") || 0),
        Others_Desc: (formData.get("Others_Desc") as string),
        DateAdded: new Date(formData.get("DateAdded") as string),
    };
    
    const { error } = await supabase
        .from("tblExpense")
        .update(updateExpense)
        .eq("ExpenseID", ExpenseID);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Expense");
    return { error: null };
}

export const deleteExpense = async (ExpenseID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblExpense, error: fetchError } = await supabase.from("tblExpense")
        .select("CreatedBy")
        .eq("ExpenseID", ExpenseID)
        .single();

    if (fetchError || !tblExpense) {
        return { error: "Expense not found!" };
    }

    const canDelete = tblExpense.CreatedBy === user.id;

    if (tblExpense.CreatedBy !== user.id) {
        return { error: "Only creator can delete" };
    }

    const { error } = await supabase.from("tblExpense")
        .delete()
        .eq("ExpenseID", ExpenseID);

    revalidatePath("/Expense");
    return { error: null };
}