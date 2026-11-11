
CREATE OR REPLACE FUNCTION public."usp_GetReportMonthlySales"(
    p_month TEXT
)
RETURNS TABLE (
    day_number INTEGER,
    day TEXT,
    "ID" NUMERIC,
    "BOH" NUMERIC,
    "Cash" NUMERIC,
    "GCash" NUMERIC,
    "Grab" NUMERIC,
    "DateAdded" TEXT,
    "isCreated" BOOLEAN,
    "Salary1" NUMERIC,
    "Salary2" NUMERIC,
    "Ice" NUMERIC,
    "Water" NUMERIC,
    "Electricity" NUMERIC,
    "Rent" NUMERIC,
    "RawMats" NUMERIC,
    "Others" NUMERIC,
    "Others_Desc" TEXT,
    "TotalSales" NUMERIC,
    "Expense" NUMERIC,
    "ExpectedCash" NUMERIC,
    "Variance" NUMERIC,
    "Cups" NUMERIC,
    "Sales_Cash" NUMERIC,
    "Sales_GCash" TEXT,
    "Sales_Grab" TEXT
)
LANGUAGE SQL
STABLE
AS $$
     
    WITH selected_month AS (
    SELECT TO_DATE(p_month || '-01', 'YYYY-MM-DD') AS month_start
),
days AS (
    SELECT generate_series(
        month_start::DATE,
        (
            month_start
            + INTERVAL '1 month'
            - INTERVAL '1 day'
        )::DATE,
        INTERVAL '1 day'
    )::DATE AS date
    FROM selected_month
),
daily_report AS (
    SELECT
        EXTRACT(DAY FROM d.date)::INTEGER AS day_number,
        TO_CHAR(d.date, 'DD Mon') AS day,

        COALESCE(ms."ID", 0) AS "ID",
        ms."BOH",
        ms."Cash",
        ms."GCash",
        ms."Grab",
        TO_CHAR(ms."DateAdded", 'YYYY-MM') AS "DateAdded",

        (
            d.date <= (NOW() AT TIME ZONE 'Asia/Manila')::DATE
        ) AS "isCreated",

        ex."Salary1",
        ex."Salary2",
        ex."Ice",
        ex."Water",
        ex."Electricity",
        ex."Rent",
        ex."RawMats",
        ex."Others",
        ex."Others_Desc",

        (
            COALESCE(SUM(i."Price" * i."Quantity"))
            -- COALESCE(ms."BOH", 0) +
            -- COALESCE(ms."Cash", 0) +
            -- COALESCE(ms."GCash", 0) +
            -- COALESCE(ms."Grab", 0)
        ) AS "TotalSales",

        (
            COALESCE(ex."Salary1", 0) +
            COALESCE(ex."Salary2", 0) +
            COALESCE(ex."Ice", 0) +
            COALESCE(ex."Water", 0) +
            COALESCE(ex."Electricity", 0) +
            COALESCE(ex."Rent", 0) +
            COALESCE(ex."RawMats", 0) +
            COALESCE(ex."Others", 0)
        ) AS "Expense",

        COALESCE(
            SUM(
                CASE
                    WHEN p."pCategory" <> 'AO' THEN i."Quantity"
                    ELSE 0
                END
            ), 0
        ) AS "Cups",
        
        COALESCE(SUM(i."Price" * i."Quantity")) AS "Sales_Cash",
        0 AS "Sales_GCash",
        0 AS "Sales_Grab"

    FROM days d

    LEFT JOIN "tblMonthlySales" ms
        ON ms."DateAdded" >= (
            d.date::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
        AND ms."DateAdded" < (
            (d.date + 1)::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )

    LEFT JOIN "tblExpense" ex
        ON ex."DateAdded" >= (
            d.date::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
        AND ex."DateAdded" < (
            (d.date + 1)::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )

    LEFT JOIN "tblTransactionItems" i
        ON i."DateAdded" >= (
            d.date::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
        AND i."DateAdded" < (
            (d.date + 1)::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
    LEFT JOIN "tblProduct" p 
        ON p."ProductID" = i."ProductID"

    GROUP BY
        d.date,
        ms."ID",
        ms."BOH",
        ms."Cash",
        ms."GCash",
        ms."Grab",
        ms."DateAdded",
        ex."Salary1",
        ex."Salary2",
        ex."Ice",
        ex."Water",
        ex."Electricity",
        ex."Rent",
        ex."RawMats",
        ex."Others",
        ex."Others_Desc"
)

SELECT
    day_number,
    day,
    "ID",
    "BOH",
    "Cash",
    "GCash",
    "Grab",
    "DateAdded",
    "isCreated",
    "Salary1",
    "Salary2",
    "Ice",
    "Water",
    "Electricity",
    "Rent",
    "RawMats",
    "Others",
    "Others_Desc",
    "TotalSales",
    "Expense",
    (COALESCE("BOH", 0) + COALESCE("Sales_Cash", 0) + COALESCE("Sales_GCash", 0) + COALESCE("Sales_Grab", 0)) - "Expense" AS "ExpectedCash",
    (COALESCE("Cash", 0) + COALESCE("GCash", 0) + COALESCE("Grab", 0))  
    -   (
            (COALESCE("BOH", 0) + COALESCE("Sales_Cash", 0) + COALESCE("Sales_GCash", 0) + COALESCE("Sales_Grab", 0)) 
            - "Expense"
        )
      AS "Variance",
    "Cups",
    "Sales_Cash",
    "Sales_GCash",
    "Sales_Grab"
FROM daily_report
ORDER BY day_number;
 


$$;
