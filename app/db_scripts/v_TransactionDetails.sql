
CREATE OR REPLACE VIEW "v_TransactionDetails"
WITH (security_invoker = true)
AS
SELECT
  transac."TransactionID",
  'SIP-' || LPAD(transac."TransactionID"::TEXT, 3, '0') AS "CustomID",
  transac."Payment",
  transac."SubTotal",
  transac."PaymentMethod",
  transac."DiscountType",
  transac."Discount",
  ROUND(CASE WHEN transac."Discount" = 0 AND transac."DiscountType" = 'Fixed' then
    transac."Payment" - transac."SubTotal"
  WHEN transac."Discount" = 0 AND transac."DiscountType" = 'Percentage' then
    transac."SubTotal" * (transac."Discount" / 100.0)
  else
    (transac."Discount" + transac."Payment") - transac."SubTotal"
  END, 2) AS "Change",
  transac."TransactionDate",
  transac."CreatedBy" AS "Cashier",
  items."ProductName",
  items."ProductID",
  items."Category",
  items."Price",
  items."Cost",
  items."Quantity",
  items."DiscountType" AS "ItemDiscount",
  ROUND(CASE WHEN COALESCE(items."DiscountType",'') != '' THEN
    items."Price" * items."Quantity"
  else
    (items."Price" * items."Quantity") *
        (1 - (20 / 100.0))
    END, 2)  AS "TotalItemPrice"
from 
  "tblTransaction" as transac
LEFT JOIN "tblTransactionItems" as items ON transac."TransactionID" = items."TransactionID"
