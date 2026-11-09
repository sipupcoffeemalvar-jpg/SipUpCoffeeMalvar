"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAllExpense } from "../actions/expense";
import type { IExpense } from "../lib/types/expense";

// Date formatter
const getDateKey = (value: string | Date | null) => {
  if (!value) return "";

  const dateString = String(value);

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const totalExpenseByDate = (
  appliedDateFrom: string,
  appliedDateTo: string,
) => {
  // FETCH EXPENSE
  const {
    data: ExpenseHistory = [],
    isLoading,
    error,
    refetch,
  } = useQuery<IExpense[]>({
    queryKey: ["expenseHistory"],
    queryFn: async () => {
      const result = await getAllExpense();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data ?? [];
    },
    staleTime: 60 * 1000,
  });

  // COMPUTE TOTAL PER EXPENSE
  const totalExpense = useMemo(() => {
    return ExpenseHistory.map((item) => ({
      ...item,
      total:
        Number(item.Ice ?? 0) +
        Number(item.Water ?? 0) +
        Number(item.Electricity ?? 0) +
        Number(item.Rent ?? 0) +
        Number(item.RawMats ?? 0) +
        Number(item.Others ?? 0) +
        Number(item.Salary1 ?? 0) +
        Number(item.Salary2 ?? 0),
    }));
  }, [ExpenseHistory]);

  // FILTER BY DATE
  const filteredExpenseHistory = useMemo(() => {
    return totalExpense.filter((item) => {
      const dateAdded = getDateKey(item.DateAdded);

      if (!dateAdded) return false;

      if (appliedDateFrom && dateAdded < appliedDateFrom) {
        return false;
      }

      if (appliedDateTo && dateAdded > appliedDateTo) {
        return false;
      }

      return true;
    });
  }, [totalExpense, appliedDateFrom, appliedDateTo]);

  // GRAND TOTAL EXPENSE
  const grandTotalExpense = useMemo(() => {
    return filteredExpenseHistory.reduce((total, item) => {
      return total + Number(item.total ?? 0);
    }, 0);
  }, [filteredExpenseHistory]);

  return {
    ExpenseHistory,
    totalExpense,
    filteredExpenseHistory,
    grandTotalExpense,
    isLoading,
    error,
    refetch,
  };
};