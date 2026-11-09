-- 1. Create table
CREATE TABLE IF NOT EXISTS public."tblCategory" (
    "CategoryID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "cCode" TEXT NOT NULL UNIQUE,
    "cDescription" TEXT
);

-- 2. Insert only if cCode does not exist
INSERT INTO public."tblCategory"
    ("cCode", "cDescription")
SELECT
    v."cCode",
    v."cDescription"
FROM (
    VALUES
        ('IC', 'Iced Coffee'),
        ('NC', 'Non-Coffee'),
        ('FR', 'Frappe'),
        ('MT', 'Matcha'),
        ('AO', 'Add Ons'),
        ('P', 'Pastry')
) AS v("cCode", "cDescription")
WHERE NOT EXISTS (
    SELECT 1
    FROM public."tblCategory" c
    WHERE c."cCode" = v."cCode"
);

-- 3. Check results
SELECT *
FROM public."tblCategory"
ORDER BY "cCode";


-- Create policy para makita ni user ang records since naka true ang RLS

CREATE POLICY "Authenticated users can view categories"
ON public."tblCategory"
FOR SELECT
TO authenticated
USING (true);
