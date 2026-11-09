
CREATE OR REPLACE VIEW "v_ReportDailySales"
WITH (security_invoker = true)
AS
SELECT
    EXTRACT(DAY FROM days.date)::INTEGER AS day_number,
    TO_CHAR(days.date, 'DD Mon') AS day,
    COALESCE(SUM(ti."Price" * ti."Quantity"), 0) AS sales
FROM generate_series(
    DATE_TRUNC('month', '2026-11-01'::DATE),
    DATE_TRUNC('month', '2026-11-01'::DATE) + INTERVAL '1 month' - INTERVAL '1 day',
    INTERVAL '1 day'
) AS days(date)
LEFT JOIN "tblTransactionItems" ti
    ON ti."DateAdded" >= days.date
    AND ti."DateAdded" < days.date + INTERVAL '1 day'
GROUP BY days.date
ORDER BY days.date;