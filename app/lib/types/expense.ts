import { StringOrTemplateHeader } from "@tanstack/react-table";

export interface IExpense {
  ExpenseID?: number;
  Ice?: number;
  Water?: number;
  Electricity?: number;
  Rent?: number;
  RawMats?: number;
  Others?: number;
  Salary1?: number;
  Salary2?: number;
  Others_Desc: string | null;
  DateAdded: Date | null;
  total?:number;
}

export interface IExpenseCreate {
  Ice?: number;
  Water?: number;
  Electricity?: number;
  Rent?: number;
  RawMats?: number;
  Others?: number;
  Salary1?: number;
  Salary2?: number;
  Others_Desc: string | null;
  DateAdded?: Date | null;
}

export interface IExpenseUpdate {
  ExpenseID: number;
  Ice?: number;
  Water?: number;
  Electricity?: number;
  Rent?: number;
  RawMats?: number;
  Others?: number;
  Salary1?: number;
  Salary2?: number;
  Others_Desc: string | null;
  DateAdded?: Date | null;
}
