const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.render('pos_xyz', { xyz1_shop: [] });
});

app.get('/sales-prodct-search', (req, res) => {
  const { product_code, product_name, product_weight, product_type, company_name } = req.query;
  const sql = `
    SELECT * FROM xyz1_shop 
    WHERE product_code LIKE ? 
    AND product_name LIKE ? 
    AND product_weight LIKE ? 
    AND product_type LIKE ? 
    AND company_name LIKE ?
  `;
  const values = [`%${product_code}%`, `%${product_name}%`, `%${product_weight}%`, `%${product_type}%`, `%${company_name}%`];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.post('/submit-sales-data', (req, res) => {
  const salesData = req.body;
  const currentTime = new Date(); // Capture the current time

  // Insert sales data into the first table (xyz1_shop_sales_report)
  const sql1 = 'INSERT INTO xyz1_shop_sales_report (sales_details) VALUES (?)';
  const values1 = [JSON.stringify(salesData)];

  connection.query(sql1, values1, (error, results) => {
    if (error) {
      console.error('Error inserting sales data into xyz1_shop_sales_report:', error);
      return res.status(500).send('Error inserting sales data into xyz1_shop_sales_report');
    } else {
      console.log('Sales data inserted successfully into xyz1_shop_sales_report');

      // Insert each product's details into the second table (xyz1_shop_sales_data)
      const sql2 = `INSERT INTO xyz1_shop_sales_datas 
        (product_code, product_name, product_weight, ingredient_name, product_type, company_name, product_quantity, sales_time) 
        VALUES ?`;

      const values2 = salesData.products.map(product => [
        product.product_code,
        product.product_name,
        product.product_weight,
        product.ingredient_name,
        product.product_type,
        product.company_name,
        product.quantity,
        currentTime // Use the captured current time
      ]);

      connection.query(sql2, [values2], (error, results) => {
        if (error) {
          console.error('Error inserting product details into xyz1_shop_sales_data:', error);
          return res.status(500).send('Error inserting product details into xyz1_shop_sales_data');
        } else {
          console.log('Product details inserted successfully into xyz1_shop_sales_data');

          // Update shop_stock quantity for each product
          const updateStockQueries = salesData.products.map(product => {
            return new Promise((resolve, reject) => {
              const sql3 = `
                UPDATE xyz1_shop 
                SET shop_stock = shop_stock - ? 
                WHERE product_code = ?
              `;
              const values3 = [product.quantity, product.product_code];
              connection.query(sql3, values3, (error, results) => {
                if (error) {
                  console.error(`Error updating shop_stock for product_code ${product.product_code}:`, error);
                  reject(error);
                } else {
                  console.log(`shop_stock updated successfully for product_code ${product.product_code}`);
                  resolve();
                }
              });
            });
          });

          Promise.all(updateStockQueries)
            .then(() => {
              res.status(200).send('Sales data and product details inserted successfully, and shop_stock updated');
            })
            .catch(error => {
              res.status(500).send('Error updating shop_stock for some products');
            });
        }
      });
    }
  });
});





app.get('/sales_report_detalis', (req, res) => {
  // Fetch sales data from the database
  const sql = 'SELECT sales_details FROM xyz1_shop_sales_report';
  connection.query(sql, (error, results) => {
      if (error) {
          console.error('Error fetching sales data:', error);
          return res.status(500).send('Error fetching sales data from database');
      }

      // Check if there are any results
      if (results.length === 0) {
          return res.render('sales_report_detalis', { salesHistory: [] }); // Render with empty data
      }

      // Parse JSON data from the database results
      const salesHistory = results.map(result => JSON.parse(result.sales_details));
      
      // Render the sales_report EJS file and pass the sales history data to it
      res.render('sales_report_detalis', { salesHistory: salesHistory });
  });
}); 

app.get('/sales_report', (req, res) => {
  // Fetch sales data from the database
  const sql = 'SELECT sales_details FROM xyz1_shop_sales_report';
  connection.query(sql, (error, results) => {
      if (error) {
          console.error('Error fetching sales data:', error);
          return res.status(500).send('Error fetching sales data from database');
      }

      // Check if there are any results
      if (results.length === 0) {
          return res.render('sales_report', { salesHistory: [] }); // Render with empty data
      }

      // Parse JSON data from the database results
      const salesHistory = results.map(result => JSON.parse(result.sales_details));
      
      // Render the sales_report EJS file and pass the sales history data to it
      res.render('sales_report', { salesHistory: salesHistory });
  });
}); 


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
