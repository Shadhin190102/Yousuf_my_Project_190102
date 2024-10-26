CREATE TRIGGER after_xyz1_insert
AFTER INSERT ON xyz1_shop_sales_datas
FOR EACH ROW
BEGIN
    INSERT INTO all_shop_sales_datas (product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time)
    VALUES (NEW.product_id, NEW.product_name, NEW.product_weight, NEW.ingredient_name, NEW.product_type, NEW.company_name, NEW.product_quantity, NEW.sales_time);
END;

CREATE TRIGGER after_xyz1_update
AFTER UPDATE ON xyz1_shop_sales_datas
FOR EACH ROW
BEGIN
    UPDATE all_shop_sales_datas
    SET product_name = NEW.product_name,
        product_weight = NEW.product_weight,
        ingredient_name = NEW.ingredient_name,
        product_type = NEW.product_type,
        company_name = NEW.company_name,
        product_quantity = NEW.product_quantity,
        sales_time = NEW.sales_time
    WHERE product_id = NEW.product_id;
END;

CREATE TRIGGER after_xyz2_insert
AFTER INSERT ON xyz2_shop_sales_datas
FOR EACH ROW
BEGIN
    INSERT INTO all_shop_sales_datas (product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time)
    VALUES (NEW.product_id, NEW.product_name, NEW.product_weight, NEW.ingredient_name, NEW.product_type, NEW.company_name, NEW.product_quantity, NEW.sales_time);
END;

CREATE TRIGGER after_xyz2_update
AFTER UPDATE ON xyz2_shop_sales_datas
FOR EACH ROW
BEGIN
    UPDATE all_shop_sales_datas
    SET product_name = NEW.product_name,
        product_weight = NEW.product_weight,
        ingredient_name = NEW.ingredient_name,
        product_type = NEW.product_type,
        company_name = NEW.company_name,
        product_quantity = NEW.product_quantity,
        sales_time = NEW.sales_time
    WHERE product_id = NEW.product_id;
END;
