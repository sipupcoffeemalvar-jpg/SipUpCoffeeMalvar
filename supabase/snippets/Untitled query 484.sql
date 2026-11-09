CREATE OR REPLACE FUNCTION public.usp_GetReportDailySales(
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
            month_start::TIMESTAMP,
            (
                month_start
                + INTERVAL '1 month'
                - INTERVAL '1 day'
            )::TIMESTAMP,
            INTERVAL '1 day'
        ) AS date
        FROM selected_month
    )
    SELECT
        EXTRACT(DAY FROM days.date)::INTEGER AS day_number,
        TO_CHAR(days.date, 'DD Mon') AS day,
        COALESCE(
            SUM(ti."Price" * ti."Quantity"),
            0
        )::NUMERIC AS sales
    FROM days
    LEFT JOIN "tblTransactionItems" ti
        ON ti."DateAdded" >= (
            days.date AT TIME ZONE 'Asia/Manila'
        )
        AND ti."DateAdded" < (
            (days.date + INTERVAL '1 day')
            AT TIME ZONE 'Asia/Manila'
        )
    GROUP BY days.date
    ORDER BY days.date;
$$;