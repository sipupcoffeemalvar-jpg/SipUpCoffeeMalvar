CREATE OR REPLACE FUNCTION public."usp_GetReportDailySales"(
    p_month TEXT
)
RETURNS TABLE (
    day_number INTEGER,
    day TEXT,
    sales NUMERIC
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
    )
    SELECT
        EXTRACT(DAY FROM d.date)::INTEGER AS day_number,
        TO_CHAR(d.date, 'DD Mon') AS day,
        COALESCE(
            SUM(ti."Price" * ti."Quantity"),
            0
        )::NUMERIC AS sales
    FROM days d
    LEFT JOIN "tblTransaction" t
        ON t."TransactionDate" >= (
            d.date::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
        AND t."TransactionDate" < (
            (d.date + 1)::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
    LEFT JOIN "tblTransactionItems" ti
        ON ti."TransactionID" = t."TransactionID"
    GROUP BY d.date
    ORDER BY d.date;
$$;