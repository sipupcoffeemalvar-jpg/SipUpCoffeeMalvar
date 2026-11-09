import { StringOrTemplateHeader } from "@tanstack/react-table";

//
// Product table
//
export type pCategory = string;

export interface tblProduct {
  ProductID: number;
  pName: string;
  pIngredients: string;
  pDescription: string;
  pIsActive: boolean;
  pAddedBy: string;
  pCategory: pCategory;
  pAssignedTo: string | null;
  pCreatedBy: string;
  pPrice?: number;
  pCost?: number;
  pImg: string;
  pCode: string;
}
export interface tblProductInsert {
  pName?: string | null;
  pCurrency?: number;
  pIngredients?: string | null;
  pDescription?: string | null;
  pIsActive?: boolean;
  pAddedBy?: string;
  pCategory?: pCategory;
  pAssignedTo?: string | null;
  pCreatedBy?: string;
  pPrice?: number;
  pCost?: number;
  pImg: string | null;
  pCode: string | null;
}

export interface tblProductUpdate {
  pName?: string | null;
  pCurrency?: number;
  pIngredients?: string | null;
  pDescription?: string | null;
  pIsActive?: boolean;
  pAddedBy?: string;
  pCategory?: pCategory;
  pAssignedTo?: string | null;
  pCreatedBy?: string;
  pPrice?: number;
  pCost?: number;
  pImg?: string | null;
  pCode?: string | null;
}


