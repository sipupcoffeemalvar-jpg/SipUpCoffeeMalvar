"use server"

import { revalidatePath } from "next/cache";
import { createClient } from "./../lib/supabase/server";
import type { pCategory, tblProduct, tblProductInsert, tblProductUpdate } from "../lib/types/database";
import { error } from "console";
import { dataTagErrorSymbol } from "@tanstack/react-query";
import { UserRoundIcon } from "lucide-react";

export const getAllProduct = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tblProduct")
        .select("*")
        .order("pName", { ascending: false });
 

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

// export const getAllProductByCategory = async (Category: string) => {
//     const supabase = await createClient();
//     const { data, error } = await supabase
//         .from("tblCategory")
//         .select("*")
//         .eq("cCode", Category)
//         .single();


//     if (error) {
//         return {
//             error: error.message,
//             data: null,
//         };
//     }

//     return {
//         error: null,
//         data,
//     };
// };


export const getProduct = async (ProductID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data, error } = await supabase.from("tblProduct")
        .select("*")
        .eq("ProductID", ProductID)
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
};


export const createProduct = async (formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }


    

    const productData: tblProductInsert = {
        pName: formData.get("pName") as string,
        pIngredients: (formData.get("pIngredients") as string) || null,
        pDescription: (formData.get("pDescription") as string) || null,
        //pCategory: (formData.get("pCategory") as pCategory) || "IcedCoffee",
        pCategory: formData.get("pCategory") as string,
        pAssignedTo: (formData.get("pAssignedTo") as string) || null,
        pIsActive: formData.get("pIsActive") === "true",
        pPrice: Number(formData.get("pPrice")),
        pCost: Number(formData.get("pCost")),
        pCode: (formData.get("pCode") as string) || null,
        pImg: (formData.get("pImg") as string) || null,
    }

    if (!productData.pName || productData.pName.trim() === "") {
        return { error: "Product name is required" };
    }

    const { error } = await supabase
        .from("tblProduct")
        .insert({
            ...productData,
            pCreatedBy: user.id,
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Product");
    return { error: null };
}


export const updateProduct = async (ProductID: number, formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblProduct, error: fetchError } = await supabase.from("tblProduct")
        .select("pCreatedBy, pAssignedTo")
        .eq("ProductID", ProductID)
        .single();

    if (fetchError || !tblProduct) {
        return { error: "Product not found!" };
    }

    const canEdit = tblProduct.pCreatedBy === user.id || tblProduct.pAssignedTo === user.id;

    if (!canEdit) {
        return { error: "You do not have permission!" };
    }

    const updateProduct: tblProductUpdate = {};

    const pName = formData.get("pName") as string;
    const pIngredients = (formData.get("pIngredients") as string) || null;
    const pDescription = (formData.get("pDescription") as string) || null;
    const pAssignedTo = (formData.get("pAssignedTo") as string) || null;
    //const pCategory = formData.get("pCategory") as pCategory;
    const pCategory = (formData.get("pCategory") as string) || null;
    const pIsActive = formData.get("pIsActive") === "true";
    const pPrice = Number(formData.get("pPrice"));
    const pCost = Number(formData.get("pCost"));
    const pCode = (formData.get("pCode") as string) || null;
    const pImg = (formData.get("pImg") as string) || null;

    if (pName) updateProduct.pName = pName;
    if (pIngredients) updateProduct.pIngredients = pIngredients;
    if (pDescription) updateProduct.pDescription = pDescription;
    if (pAssignedTo) updateProduct.pAssignedTo = pAssignedTo;
    if (pCategory) updateProduct.pCategory = pCategory;
    if (pImg) updateProduct.pImg = pImg;
    if (pCode) updateProduct.pCode = pCode;
    updateProduct.pIsActive = pIsActive;
    updateProduct.pPrice = pPrice;
    updateProduct.pCost = pCost;

    const { error } = await supabase.from("tblProduct").update
        (updateProduct).eq("ProductID", ProductID);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/Product");
    return { error: null };
}

export const deleteProduct = async (ProductID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: tblProduct, error: fetchError } = await supabase.from("tblProduct")
        .select("pCreatedBy")
        .eq("ProductID", ProductID)
        .single();

    if (fetchError || !tblProduct) {
        return { error: "Product not found!" };
    }

    const canDelete = tblProduct.pCreatedBy === user.id;

    if (tblProduct.pCreatedBy !== user.id) {
        return { error: "Only creator can delete" };
    }

    const { error } = await supabase.from("tblProduct")
        .delete()
        .eq("ProductID", ProductID);

    revalidatePath("/Product");
    return { error: null };
}