CREATE OR REPLACE FUNCTION public.usp_CreateTodayMonthlySales()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_today DATE := (NOW() AT TIME ZONE 'Asia/Manila')::DATE;
    v_user_id UUID;
BEGIN
    SELECT id
    INTO v_user_id
    FROM auth.users
    WHERE email = 'carandangkevin023@gmail.com'
    LIMIT 1;

    PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtext('tblMonthlySales_today')
    );
    

    IF NOT EXISTS (
        SELECT 1
        FROM public."tblMonthlySales"
        WHERE "DateAdded" >= (
            v_today::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
        AND "DateAdded" < (
            (v_today + 1)::TIMESTAMP AT TIME ZONE 'Asia/Manila'
        )
    ) THEN
        INSERT INTO public."tblMonthlySales" ("DateAdded", "CreatedBy")
        VALUES (
            v_today::TIMESTAMP AT TIME ZONE 'Asia/Manila',
            v_user_id
        );
    END IF;
END;
$$;