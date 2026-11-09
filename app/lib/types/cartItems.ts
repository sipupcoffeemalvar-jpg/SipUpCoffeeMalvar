import { StringOrTemplateHeader } from "@tanstack/react-table";
export type DiscountType = "none" | "pwd" | "student";

import type { tblProduct } from "../types/database";

export interface CartItem {
  ProductID: tblProduct["ProductID"];
  pName: string;
  pCode: string | null;
  pPrice: number;
  pCost: number;
  quantity: number;
  subtotal: number;
  discountType?: DiscountType;
}

//
//Transaction table
//
export type PaymentMethod = "Cash" | "GCash";


export interface ITransaction {
  TransactionID: number;
  Payment: string;
  SubTotal: string;
  PaymentMethod: PaymentMethod;
  DiscountType: DiscountType;
  Discount: string;
  CreatedBy: string | null;
}

export interface ITransactionInsert {
  Payment?: string;
  SubTotal?: string;
  PaymentMethod?: PaymentMethod;
  DiscountType?: DiscountType;
  Discount?: string;
  CreatedBy?: string | null;
}

export interface ITransactionUpdate {
  Payment?: string;
  SubTotal?: string;
  PaymentMethod?: PaymentMethod;
  DiscountType?: DiscountType;
  Discount?: string;
  CreatedBy?: string | null;
}


export interface ITransacItems {
  TransactionID: number;
  ProductID: number;
  ProductName?: string;
  Category?: string;
  Price?: number;
  Cost?: number;
  DiscountType?: string;
  Quantity?: number;
}



export interface ITransacItemsSave {
  TransactionID: number;
  ProductID: number;
  ProductName?: string;
  Category?: string;
  Price?: number;
  Cost?: number;
  DiscountType?: string | null;
  Quantity?: number;
}

export interface ITransacItemsUpdate {
  TransactionID: number;
  ProductID: number;
  ProductName?: string;
  Category?: string;
  Price?: number;
  Cost?: number;
  DiscountType?: string;
  Quantity?: number;
}

