CREATE OR REPLACE FUNCTION public.usp_CreateTodayMonthlySales()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_today DATE := (NOW() AT TIME ZONE 'Asia/Manila')::DATE;
    v_start_date DATE;
    v_date DATE;
    v_user_id UUID;
BEGIN
    -- First day of current month
    v_start_date := DATE_TRUNC('month', v_today)::DATE;

    -- Get user ID
    SELECT id
    INTO v_user_id
    FROM auth.users
    WHERE email = 'carandangkevin023@gmail.com'
    LIMIT 1;

    -- Prevent simultaneous execution
    PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtext('tblMonthlySales_today')
    );

    -- Create missing records from first day until today
    FOR v_date IN
        SELECT generate_series(
            v_start_date,
            v_today,
            INTERVAL '1 day'
        )::DATE
    LOOP

        IF NOT EXISTS (
            SELECT 1
            FROM public."tblMonthlySales"
            WHERE "DateAdded" >= (
                v_date::TIMESTAMP AT TIME ZONE 'Asia/Manila'
            )
            AND "DateAdded" < (
                (v_date + 1)::TIMESTAMP AT TIME ZONE 'Asia/Manila'
            )
        ) THEN

            INSERT INTO public."tblMonthlySales" (
                "DateAdded",
                "CreatedBy"
            )
            VALUES (
                v_date::TIMESTAMP AT TIME ZONE 'Asia/Manila',
                v_user_id
            );

        END IF;

    END LOOP;
END;
$$;