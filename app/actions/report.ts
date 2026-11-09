"use server";

import { createClient } from "../lib/supabase/server";

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