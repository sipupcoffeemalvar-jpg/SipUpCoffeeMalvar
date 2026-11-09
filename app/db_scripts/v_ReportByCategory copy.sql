
CREATE OR REPLACE VIEW "v_ReportByCategory"
WITH (security_invoker = true)
AS
select
  p."ProductID",
  cat."cCode",
  cat."cDescription",
  i."Category",
  i."ProductName",
  i."DiscountType",
  TO_CHAR(i."DateAdded", 'YYYY-MM') AS "DateAdded",
  --TO_CHAR(i."DateAdded", 'MM/DD/YYYY') AS "DateAdded",
  i."Price" * SUM(i."Quantity") AS "TotalSales",
  i."Cost" * SUM(i."Quantity") AS "TotalCost",
  SUM(i."Quantity") AS "TotalCups"
from
"tblProduct" AS p
JOIN "tblCategory" AS cat ON p."pCategory" = cat."cCode"
JOIN "tblTransactionItems" AS i ON p."ProductID" = i."ProductID"
--JOIN "tblTransaction" AS t ON t."TransactionID" = i."TransactionID"
GROUP BY
  p."ProductID",
  cat."cCode",
  cat."cDescription",
  i."Category",
  i."ProductName",
  i."DiscountType",
  i."Price",
  i."Cost",
  TO_CHAR(i."DateAdded", 'YYYY-MM')
ORDER BY 
  p."ProductID" asc