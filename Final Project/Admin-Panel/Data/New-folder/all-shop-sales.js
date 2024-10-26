const mysql = require('mysql');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Enter your MySQL password here
  database: 'product'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');

  // Create all_shop_sales_datas table
  const createAllShopSalesDatasTable = `
    CREATE TABLE IF NOT EXISTS all_shop_sales_datas (
      id INT(11) NOT NULL AUTO_INCREMENT,
      product_id VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_weight VARCHAR(255),
      ingredient_name VARCHAR(255),
      product_type VARCHAR(255),
      company_name VARCHAR(255),
      product_quantity INT(11) NOT NULL,
      sales_time DATETIME,
      PRIMARY KEY (id)
    )`;

  connection.query(createAllShopSalesDatasTable, (err, results) => {
    if (err) {
      console.error('Error creating all_shop_sales_datas table: ', err);
      return;
    }
    console.log('Table all_shop_sales_datas created successfully');
  });

  // Create xyz1_shop_sales_datas table
  const createXyz1ShopSalesDatasTable = `
    CREATE TABLE IF NOT EXISTS xyz1_shop_sales_datas (
      id INT(11) NOT NULL AUTO_INCREMENT,
      product_id VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_weight VARCHAR(255),
      ingredient_name VARCHAR(255),
      product_type VARCHAR(255),
      company_name VARCHAR(255),
      product_quantity INT(11) NOT NULL,
      sales_time DATETIME,
      PRIMARY KEY (id)
    )`;

  connection.query(createXyz1ShopSalesDatasTable, (err, results) => {
    if (err) {
      console.error('Error creating xyz1_shop_sales_datas table: ', err);
      return;
    }
    console.log('Table xyz1_shop_sales_datas created successfully');
  });

  // Create xyz2_shop_sales_datas table
  const createXyz2ShopSalesDatasTable = `
    CREATE TABLE IF NOT EXISTS xyz2_shop_sales_datas (
      id INT(11) NOT NULL AUTO_INCREMENT,
      product_id VARCHAR(255) NOT NULL,
      product_name VARCHAR(255) NOT NULL,
      product_weight VARCHAR(255),
      ingredient_name VARCHAR(255),
      product_type VARCHAR(255),
      company_name VARCHAR(255),
      product_quantity INT(11) NOT NULL,
      sales_time DATETIME,
      PRIMARY KEY (id)
    )`;

  connection.query(createXyz2ShopSalesDatasTable, (err, results) => {
    if (err) {
      console.error('Error creating xyz2_shop_sales_datas table: ', err);
      return;
    }
    console.log('Table xyz2_shop_sales_datas created successfully');
  });

  // Define triggers with new names
  const triggers = [
    `CREATE TRIGGER after_xyz1_insert_new
    AFTER INSERT ON xyz1_shop_sales_datas
    FOR EACH ROW
    BEGIN
        INSERT INTO all_shop_sales_datas (product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time)
        VALUES (NEW.product_id, NEW.product_name, NEW.product_weight, NEW.ingredient_name, NEW.product_type, NEW.company_name, NEW.product_quantity, NEW.sales_time);
        INSERT INTO trigger_logs (trigger_name, action_type, timestamp)
        VALUES ('after_xyz1_insert_new', 'INSERT', NOW());
    END;`,

    `CREATE TRIGGER after_xyz1_update_new
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
        INSERT INTO trigger_logs (trigger_name, action_type, timestamp)
        VALUES ('after_xyz1_update_new', 'UPDATE', NOW());
    END;`,

    `CREATE TRIGGER after_xyz2_insert_new
    AFTER INSERT ON xyz2_shop_sales_datas
    FOR EACH ROW
    BEGIN
        INSERT INTO all_shop_sales_datas (product_id, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time)
        VALUES (NEW.product_id, NEW.product_name, NEW.product_weight, NEW.ingredient_name, NEW.product_type, NEW.company_name, NEW.product_quantity, NEW.sales_time);
        INSERT INTO trigger_logs (trigger_name, action_type, timestamp)
        VALUES ('after_xyz2_insert_new', 'INSERT', NOW());
    END;`,

    `CREATE TRIGGER after_xyz2_update_new
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
        INSERT INTO trigger_logs (trigger_name, action_type, timestamp)
        VALUES ('after_xyz2_update_new', 'UPDATE', NOW());
    END;`
  ];

  // Execute each trigger creation separately
  triggers.forEach(trigger => {
    console.log('Executing trigger:', trigger); // Log trigger SQL statement
    connection.query(trigger, (err, results) => {
      if (err) {
        console.error('Error creating trigger: ', err.sqlMessage);
        return;
      }
      console.log('Trigger created successfully');
    });
  });
});

// Keep the MySQL connection alive (optional)
setInterval(() => {
  connection.query('SELECT 1', (err, results) => {
    if (err) {
      console.error('Error keeping MySQL connection alive: ', err);
      return;
    }
    console.log('MySQL connection is alive');
  });
}, 5000);

// Close the MySQL connection gracefully on SIGINT
process.on('SIGINT', () => {
  console.log('Closing MySQL connection...');
  connection.end(err => {
    if (err) {
      console.error('Error closing MySQL connection: ', err);
      process.exit(1);
    }
    console.log('MySQL connection closed');
    process.exit(0);
  });
});
