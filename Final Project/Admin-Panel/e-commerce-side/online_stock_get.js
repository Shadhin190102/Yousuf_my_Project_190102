const mysql = require('mysql');

// MySQL Connection Configuration
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
  // Call the function to copy data initially after connection
  copyDataInitially();
});

// Step 1: Copy data from xyz1_shop to all_shop_stock initially
const copyDataInitially = () => {
  const query = `
    INSERT INTO all_shop_stock
    (product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock)
    SELECT
      xyz1.product_code,
      xyz1.product_name,
      xyz1.product_weight,
      xyz1.product_type,
      xyz1.company_name,
      xyz1.shop_name,
      xyz1.shop_area,
      xyz1.price,
      xyz1.shop_stock
    FROM
      xyz1_shop AS xyz1
    ON DUPLICATE KEY UPDATE
      product_name = xyz1.product_name,
      product_weight = xyz1.product_weight,
      product_type = xyz1.product_type,
      company_name = xyz1.company_name,
      shop_name = xyz1.shop_name,
      shop_area = xyz1.shop_area,
      price = xyz1.price,
      shop_stock = xyz1.shop_stock;
  `;
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log('Initial data copied successfully');
    // Start monitoring changes after initial copy
    monitorChanges();
  });
};

// Step 3: Implement continuous monitoring in Node.js
const monitorChanges = () => {
  // Here you can implement logic to continuously monitor changes in all_shop_stock
  // For simplicity, let's log the data from all_shop_stock periodically
  setInterval(() => {
    const query = 'SELECT * FROM all_shop_stock';
    connection.query(query, (err, rows) => {
      if (err) throw err;
      console.log('All_shop_stock data:', rows);
    });
  }, 5000); // Adjust the interval as needed
};
