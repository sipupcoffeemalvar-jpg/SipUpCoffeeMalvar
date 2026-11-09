"use server"
 
import { createClient } from "../lib/supabase/server";

export const getAllCategory = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tblCategory")
        .select("*")
        .order("cCode", { ascending: false });


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


export const getCategory = async (CategoryID: string) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data, error } = await supabase.from("tblCategory")
        .select("*")
        .eq("CategoryID", CategoryID)
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
};
