"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "./../lib/supabase/server";
import { IMonthlySales } from "../lib/types/Reports";

export const ReportTable = async () => {
    const supabase = await createClient();

    const { data: reportData, error } = await supabase
        .from("v_TransactionDetails")
        .select("*");

    if (error) {
        return {
            error: error.message,
            reportData: null,
        };
    }

    return {
        error: null,
        reportData,
    };
};

export const ReportTableGroupItems = async () => {
    const supabase = await createClient();

    const { data: TransacData, error } = await supabase
        .from("v_TransactionDetails")
        .select("*")
        .order("TransactionID", { ascending: false });

    if (error) {
        return {
            error: error.message,
            TransacData: null,
        };
    }

    type TransactionRow = (typeof TransacData)[number];

    type GroupedTransaction = TransactionRow & {
        Products: {
            ProductID: TransactionRow["ProductID"];
            ProductName: TransactionRow["ProductName"];
            Category: TransactionRow["Category"];
            Price: TransactionRow["Price"];
            Cost: TransactionRow["Cost"];
            Quantity: TransactionRow["Quantity"];
            TotalItemPrice: TransactionRow["TotalItemPrice"];
            ItemDiscount: TransactionRow["ItemDiscount"];
        }[];
    };

    const groups: Record<number, GroupedTransaction> = {};

    TransacData.forEach((item) => {
        const id = item.TransactionID;

        if (!groups[id]) {
            groups[id] = {
                ...item,
                Products: [],
            };
        }

        if (item.ProductID !== null) {
            let Price = Number(item.Price);
            let finalPrice = 0 ;
            if (
                item.ItemDiscount?.toLowerCase() === "pwd" ||
                item.ItemDiscount?.toLowerCase() === "student"
            ) {
                finalPrice = Price - (Price * (20 / 100));
            } else {
                finalPrice = Number(item.Price);
            }


            groups[id].Products.push({
                ProductID: item.ProductID,
                ProductName: item.ProductName,
                Category: item.Category,
                Price: item.Price,
                Cost: item.Cost,
                Quantity: item.Quantity,
                TotalItemPrice: item.TotalItemPrice,
                ItemDiscount: item.ItemDiscount,
            });
        }
    });

    return {
        error: null,
        TransacData: Object.values(groups),
    };
};



export const GetItemByCategory = async () => {
    const supabase = await createClient();

    const { data: reportByCategoryData, error } = await supabase
        .from("v_ReportByCategory")
        .select("*");

    if (error) {
        return {
            error: error.message,
            reportByCategoryData: null,
        };
    }

    return {
        error: null,
        reportByCategoryData,
    };
};



export async function GetReportDailySales(selectedMonth: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "usp_GetReportDailySales",
    {
      p_month: selectedMonth,
    }
  );

  return {
    reportDailySales: data ?? [],
    error: error?.message ?? null,
  };
}

/* =============================
    Monthly Report
 ============================= */

export async function GetMonthlySalesReport(selectedMonth: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "usp_GetReportMonthlySales",
    {
      p_month: selectedMonth,
    }
  );

  return {
    reportDailySales: data ?? [],
    error: error?.message ?? null,
  };
}

export const getAllMonthlySales = async () => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("tblMonthlySales")
        .select("*")
        .order("ID", { ascending: true });


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


export const getMonthlySalesByID = async (ID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data, error } = await supabase.from("tblMonthlySales")
        .select("*")
        .eq("ID", ID)
        .single();

    if (error) {
        return { error: error.message, data: null };
    }

    return { error: null, data };
};

export const createMonthlySales = async (formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const MonthlySalesData: IMonthlySales = {
        ID:  0,
        BOH:  Number(formData.get("BOH") || 0),
        Cash:  Number(formData.get("Cash") || 0),
        GCash:  Number(formData.get("GCash") || 0),
        Grab:  Number(formData.get("Grab") || 0)
    }

    const { error } = await supabase
        .from("tblMonthlySales")
        .insert({
            ...MonthlySalesData,
            CreatedBy: user.id,
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/MonthlySales");
    return { error: null };
}

export const updateMonthlySales = async (
    ID: number,
    formData: Partial<IMonthlySales>
) => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null };
    }

    const { data: MonthlySalesData, error: fetchError } =
        await supabase
            .from("tblMonthlySales")
            .select("CreatedBy")
            .eq("ID", ID)
            .single();

    if (fetchError || !MonthlySalesData) {
        return { error: "MonthlySales not found!" };
    }

    const canEdit = MonthlySalesData.CreatedBy === user.id;

    // if (!canEdit) {
    //     return { error: "You do not have permission!" };
    // }

    const updateMonthlySales: Partial<IMonthlySales> = {};

    if (formData.BOH !== undefined)
        updateMonthlySales.BOH = Number(formData.BOH);

    if (formData.Cash !== undefined)
        updateMonthlySales.Cash = Number(formData.Cash);

    if (formData.GCash !== undefined)
        updateMonthlySales.GCash = Number(formData.GCash);

    if (formData.Grab !== undefined)
        updateMonthlySales.Grab = Number(formData.Grab);

    const { error } = await supabase
        .from("tblMonthlySales")
        .update(updateMonthlySales)
        .eq("ID", ID);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/MonthlySales");

    return { error: null };
};

export const updateMonthlySalesByForm = async (ID: number, formData: FormData) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: MonthlySalesData, error: fetchError } = await supabase.from("tblMonthlySales")
        .select("CreatedBy")
        .eq("ID", ID)
        .single();

    if (fetchError || !MonthlySalesData) {
        return { error: "MonthlySales not found!" };
    }

    const canEdit = MonthlySalesData.CreatedBy === user.id;

    if (!canEdit) {
        return { error: "You do not have permission!" };
    }

    const updateMonthlySales: IMonthlySales = {
        BOH:  Number(formData.get("BOH") || 0),
        Cash:  Number(formData.get("Cash") || 0),
        GCash:  Number(formData.get("GCash") || 0),
        Grab:  Number(formData.get("Grab") || 0)
    };
    
    const { error } = await supabase
        .from("tblMonthlySales")
        .update(updateMonthlySales)
        .eq("ID", ID);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/MonthlySales");
    return { error: null };
}

export const deleteMonthlySales = async (ID: number) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const { data: MonthlySalesData, error: fetchError } = await supabase.from("tblMonthlySales")
        .select("CreatedBy")
        .eq("ID", ID)
        .single();

    if (fetchError || !MonthlySalesData) {
        return { error: "MonthlySales not found!" };
    }

    const canDelete = MonthlySalesData.CreatedBy === user.id;

    if (MonthlySalesData.CreatedBy !== user.id) {
        return { error: "Only creator can delete" };
    }

    const { error } = await supabase.from("tblMonthlySales")
        .delete()
        .eq("ID", ID);

    revalidatePath("/MonthlySales");
    return { error: null };
}



/* =========================================
    Create new record in tblMonthlySales
   =========================================  */

   export async function CreateDailySales() {
    const supabase = await createClient();

    const { error } = await supabase.rpc(
  "usp_createtodaymonthlysales"
);

    return {
    createDailySales: null,
    error: error?.message ?? null,
    };
    }