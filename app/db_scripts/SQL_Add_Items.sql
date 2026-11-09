
INSERT INTO public."tblProduct" (
    "pImg",
    "pName",
    "pIngredients",
    "pDescription",
    "pPrice",
    "pCost",
    "pCode",
    "pIsActive",
    "pAddedBy",
    "pCategory",
    "pAssignedTo",
    "pCreatedBy"
)
VALUES
-- Iced Coffee (IC)
(NULL, 'Americano', 'Espresso, Water, Ice', 'Classic iced Americano', 89.00, 28.00, 'IC001', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'IC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Cafe Latte', 'Espresso, Fresh Milk, Ice', 'Smooth iced cafe latte', 99.00, 35.00, 'IC002', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'IC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Spanish Latte', 'Espresso, Milk, Condensed Milk, Ice', 'Sweet and creamy Spanish latte', 109.00, 39.00, 'IC003', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'IC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Caramel Macchiato', 'Espresso, Milk, Vanilla Syrup, Caramel Sauce, Ice', 'Iced caramel macchiato', 119.00, 43.00, 'IC004', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'IC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Mocha Latte', 'Espresso, Milk, Chocolate Sauce, Ice', 'Chocolate flavored iced coffee', 109.00, 40.00, 'IC005', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'IC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),

-- Non-Coffee (NC)
(NULL, 'Chocolate Milk', 'Chocolate Powder, Fresh Milk, Ice', 'Creamy iced chocolate drink', 99.00, 34.00, 'NC001', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'NC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Strawberry Milk', 'Strawberry Syrup, Fresh Milk, Ice', 'Sweet strawberry milk', 99.00, 33.00, 'NC002', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'NC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Vanilla Milk', 'Vanilla Syrup, Fresh Milk, Ice', 'Refreshing vanilla milk', 89.00, 30.00, 'NC003', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'NC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Taro Milk', 'Taro Powder, Fresh Milk, Ice', 'Creamy taro milk drink', 109.00, 38.00, 'NC004', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'NC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Cookies and Cream Milk', 'Cookies, Fresh Milk, Ice', 'Cookies and cream milk drink', 119.00, 44.00, 'NC005', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'NC', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),

-- Frappe (FR)
(NULL, 'Caramel Frappe', 'Coffee, Milk, Caramel Sauce, Ice, Whipped Cream', 'Blended caramel coffee frappe', 128.00, 48.00, 'FR001', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'FR', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Mocha Frappe', 'Coffee, Milk, Chocolate Sauce, Ice, Whipped Cream', 'Blended mocha frappe', 128.00, 47.00, 'FR002', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'FR', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Java Chip Frappe', 'Coffee, Milk, Chocolate Chips, Chocolate Sauce, Ice', 'Chocolate chip blended coffee', 138.00, 52.00, 'FR003', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'FR', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Oreo Frappe', 'Oreo Cookies, Milk, Ice, Whipped Cream', 'Cookies and cream blended drink', 128.00, 46.00, 'FR004', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'FR', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Strawberry Frappe', 'Strawberry Syrup, Milk, Ice, Whipped Cream', 'Blended strawberry frappe', 128.00, 45.00, 'FR005', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'FR', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),

-- Matcha (MT)
(NULL, 'Matcha Latte', 'Matcha Powder, Fresh Milk, Ice', 'Classic iced matcha latte', 118.00, 42.00, 'MT001', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'MT', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Strawberry Matcha', 'Matcha Powder, Strawberry Syrup, Fresh Milk, Ice', 'Layered strawberry matcha latte', 128.00, 46.00, 'MT002', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'MT', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Oreo Matcha', 'Matcha Powder, Oreo Cookies, Fresh Milk, Ice', 'Matcha with crushed Oreo cookies', 138.00, 51.00, 'MT003', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'MT', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Vanilla Matcha', 'Matcha Powder, Vanilla Syrup, Fresh Milk, Ice', 'Smooth vanilla matcha latte', 128.00, 45.00, 'MT004', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'MT', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e'),
(NULL, 'Matcha Frappe', 'Matcha Powder, Fresh Milk, Ice, Whipped Cream', 'Blended creamy matcha drink', 128.00, 47.00, 'MT005', TRUE, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e', 'MT', NULL, 'dc9f0361-2475-44c4-8eee-4d92a6818a8e');
