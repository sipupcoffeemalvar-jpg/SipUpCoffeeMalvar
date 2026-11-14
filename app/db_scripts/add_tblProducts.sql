-- INSERT script generated from the supplied Supabase product export.
-- Target table: public."tblProduct"
-- pCategoryNotUsed was omitted because it is not part of the tblProduct schema.

BEGIN;

INSERT INTO public."tblProduct" (
    "pImg", "pName", "pIngredients", "pDescription", "pPrice", "pCost", "pCode", "pIsActive", "pAddedBy", "pCategory", "pAssignedTo", "pCreatedBy", "pDateAdded", "pDateUpdated"
) VALUES
    (NULL, 'Iced Latte', NULL, NULL, '88.00', '36.28', 'IL', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:32:09.319582+00', '2026-11-10 06:32:09.319582+00'),
    (NULL, 'Iced Caramel macchiato ', 'Caramel', 'Caramel', '88.00', '44.12', 'ICM', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-03 10:02:44.9578+00', '2026-11-03 10:02:44.9578+00'),
    ( NULL, 'Classic Lemon', 'Lemon', 'Lemon', '55.00', '15.00', 'CL', TRUE, NULL, 'NC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-03 10:03:31.126942+00', '2026-11-03 10:03:31.126942+00'),
    ( NULL, 'Salted Caramel', 'Salted Caramel', 'Salted Caramel', '118.00', '52.02', 'SC', TRUE, NULL, 'FR', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-03 10:04:06.323294+00', '2026-11-03 10:04:06.323294+00'),
    ( NULL, 'Iced Chocolate', 'Chocolate', 'Chocolate', '88.00', '31.76', 'IC', TRUE, NULL, 'NC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-03 10:07:27.072428+00', '2026-11-03 10:07:27.072428+00'),
    ( NULL, 'Spanish Latte', 'Spanish', 'Spanish', '88.00', '39.51', 'SL', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-04 03:11:18.285307+00', '2026-11-04 03:11:18.285307+00'),
    ( NULL, 'Java Chips', NULL, NULL, '118.00', '54.20', 'JC', TRUE, NULL, 'FR', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-04 08:20:22.927297+00', '2026-11-04 08:20:22.927297+00'),
    ( NULL, 'Cookies & Cream', NULL, NULL, '118.00', '60.26', 'CC', TRUE, NULL, 'FR', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-04 09:48:29.854074+00', '2026-11-04 09:48:29.854074+00'),
    ( NULL, 'Cafe Mocha', NULL, NULL, '88.00', '43.57', 'CM', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-05 08:49:39.479197+00', '2026-11-05 08:49:39.479197+00'),
    ( NULL, 'Dark Choco', NULL, NULL, '118.00', '54.20', 'DC', TRUE, NULL, 'FR', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-05 08:50:09.595024+00', '2026-11-05 08:50:09.595024+00'),
    ( NULL, 'Sparkling Green Apple', NULL, NULL, '65.00', '20.00', 'SGA', TRUE, NULL, 'NC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-09 09:52:51.231474+00', '2026-11-09 09:52:51.231474+00'),
    ( NULL, 'Yakult', NULL, NULL, '15.00', '10.00', 'YAKULT', TRUE, NULL, 'AO', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-09 09:53:18.591258+00', '2026-11-09 09:53:18.591258+00'),
    ( NULL, 'Classic Green Apple', NULL, NULL, '60.00', '15.00', 'CGA', TRUE, NULL, 'NC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:29:09.671573+00', '2026-11-10 06:29:09.671573+00'),
    ( NULL, 'Espresso Soda', NULL, NULL, '88.00', '25.24', 'ES', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:30:14.222872+00', '2026-11-10 06:30:14.222872+00'),
    ( NULL, 'Hazelnut Latte', NULL, NULL, '88.00', '44.47', 'HL', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:31:06.30679+00', '2026-11-10 06:31:06.30679+00'),
    ( NULL, 'Iced Americano', NULL, NULL, '78.00', '17.24', 'IA', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:31:39.663116+00', '2026-11-10 06:31:39.663116+00'),
    ( NULL, 'Oreo', NULL, NULL, '10.00', '5.00', 'OREO', TRUE, NULL, 'AO', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:33:33.822676+00', '2026-11-10 06:33:33.822676+00'),
    ( NULL, 'Syrup', NULL, NULL, '10.00', '5.00', 'SYRUP', TRUE, NULL, 'AO', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:33:11.17295+00', '2026-11-10 06:33:48.612143+00'),
    ( NULL, 'Milk', NULL, NULL, '5.00', '10.00', 'MILK', TRUE, NULL, 'AO', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:34:10.820498+00', '2026-11-10 06:34:10.820498+00'),
    ( NULL, 'Choco Matcha', NULL, NULL, '118.00', '64.46', 'CM', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:35:59.358679+00', '2026-11-10 06:35:59.358679+00'),
    ( NULL, 'Matcha Latte', NULL, NULL, '128.00', '80.00', 'ML', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:35:17.106911+00', '2026-11-10 06:36:40.838369+00'),
    ( NULL, 'Matcha Frappe', NULL, NULL, '128.00', '80.00', 'MF', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:37:25.969997+00', '2026-11-10 06:37:25.969997+00'),
    ( NULL, 'Choco Matcha Frappe', NULL, NULL, '128.00', '80.00', 'CMF', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:37:50.10564+00', '2026-11-10 06:37:50.10564+00'),
    ( NULL, 'Strawberry Matcha Frappe', NULL, NULL, '128.00', '80.00', 'SMF', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:38:09.597841+00', '2026-11-10 06:38:09.597841+00'),
    ( NULL, 'Strawberry Matcha', NULL, NULL, '128.00', '69.93', 'SM', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:36:29.924093+00', '2026-11-10 06:38:18.022383+00'),
    ( NULL, 'Oreo Matcha Frappe', NULL, NULL, '128.00', '80.00', 'OMF', TRUE, NULL, 'MT', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:38:36.384403+00', '2026-11-10 06:38:36.384403+00'),
    ( NULL, 'Ube Frappe', NULL, NULL, '118.00', '47.10', 'UBE', TRUE, NULL, 'FR', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:41:33.682041+00', '2026-11-10 06:41:33.682041+00'),
    ( NULL, 'Sip Up Brew', NULL, NULL, '88.00', '44.77', 'SUB', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:32:36.471334+00', '2026-11-11 02:10:01.637808+00'),
    ( NULL, 'French Vanilla', NULL, NULL, '88.00', '45.11', 'FV', TRUE, NULL, 'IC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:30:38.864603+00', '2026-11-11 02:10:09.656742+00'),
    ( NULL, 'Classic Strawberry', NULL, NULL, '60.00', '20.00', 'CS', TRUE, NULL, 'NC', NULL, '2080694c-c48b-4569-8fa5-3c81e507ce7a', '2026-11-10 06:29:35.690678+00', '2026-11-11 02:10:16.860445+00')
ON CONFLICT ("ProductID") DO NOTHING;

-- Sync the serial/identity sequence with the largest ProductID.
SELECT setval(
    pg_get_serial_sequence('public."tblProduct"', 'ProductID'),
    COALESCE((SELECT MAX("ProductID") FROM public."tblProduct"), 1),
    EXISTS (SELECT 1 FROM public."tblProduct")
);

COMMIT;
