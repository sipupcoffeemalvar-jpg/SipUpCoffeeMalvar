import { StringOrTemplateHeader } from "@tanstack/react-table";

export interface ReportProduct {
  TransactionID: number;
  CustomID: string;
  Payment: number;
  SubTotal: number;
  PaymentMethod: string;
  ItemDiscount: string;
  Discount: number;
  Change: number;
  TransactionDate: Date;
  Cashier: string;
  ProductName: string;
  ProductID: number;
  Category: string;
  Price: number;
  Cost: number;
  Quantity: number;
  TotalItemPrice: number;
}

export interface ReportHistory {
  TransactionID: number;
  CustomID: string;
  Payment: number;
  SubTotal: number;
  PaymentMethod: string;
  ItemDiscount: string;
  Discount: number;
  Change: number;
  TransactionDate: Date;
  Cashier: string;
  ProductName: string;
  ProductID: number;
  Category: string;
  Price: number;
  Cost:number;
  Quantity: number;
  TotalItemPrice: number;

  Products: ReportProduct[];
}

export interface IReportByCategory {
  cCode: string;
  cDescription: string;
  Category: string;
  ProductName: string;
  DiscountType: string;
  DateAdded: Date;
  TotalSales: number;
  TotalCost: number;
  TotalCups: number;
}

export interface IDailySales {
  day_number: number;
  day: string;
  sales: number;
}