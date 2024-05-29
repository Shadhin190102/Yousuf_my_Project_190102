const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const port = 8081;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// Middleware for database connection
function connectDB(req, res, next) {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "product"
    });
    con.connect(function(error) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            req.con = con;
            next();
        }
    });
}

// Route to fetch all products
app.get('/shop-online-order', connectDB, function(req, res) {
    const con = req.con;
    con.query("SELECT * FROM product_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/shop-online-order", { product_database: result });
        }
        con.end(); // Close the connection
    });
});

app.get('/shop-order-review', connectDB, function(req, res) {
  const con = req.con;
  con.query("SELECT * FROM shop_product_order_review", function(error, result) {
      if (error) {
          console.log(error);
          res.status(500).send('Internal Server Error');
      } else {
          res.render(__dirname + "/shop-order-review", { shop_product_order_review: result });
      }
      con.end(); // Close the connection
  });
});

app.post('/cancel-item', connectDB, function(req, res) {
  const con = req.con;
  const itemId = req.body.id;

  const sql = "DELETE FROM shop_product_order_review WHERE id = ?";
  con.query(sql, [itemId], function(error, result) {
      if (error) {
          console.log(error);
          res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/shop-order-review'); // Send back the ID of the deleted item
      }
      con.end(); // Close the connection
  });
});

// Route to search products
app.get('/online-product-search', connectDB, function(req, res) {
    const con = req.con;
    const { id, productName, companyName, productType } = req.query;
    const sql = "SELECT * FROM product_database WHERE id LIKE ? AND productName LIKE ? AND companyName LIKE ? AND productType LIKE ?";
    const values = [`%${id}%`, `%${productName}%`, `%${companyName}%`, `%${productType}%`];

    con.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/shop-online-order", { product_database: result });
        }

        // Close the connection after query completes
        con.end();
    });
});




app.get('/online-product-details', function(req, res) {
  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
  });

  con.connect(function(error) {
    if (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
      return;
    }
    
    const id = req.query.id;
    const sql = "SELECT * FROM product_database WHERE id=?";
    
    con.query(sql, [id], function(error, result) {
      if (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
      } else {
        res.render(__dirname + "/online-product-details", { product_database: result });
      }
      
      con.end(); // Close the connection
    });
  });
});



app.post('/submit-product', (req, res) => {

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
  })

  console.log('Received JSON data:', req.body);

  const { Id, 'Product Name': productName, 'Product Pcs': productPcs, Weight, Company, 'Product Type': productType, single_price, box_price, discount, Quantity, a_d_b_price } = req.body;

  if (!Id || !productName || !productPcs || !Weight || !Company || !productType || !single_price || !box_price || !discount || !Quantity || !a_d_b_price) {
    return res.status(400).send('All fields are required');
  }

  const sql = 'INSERT INTO shop_product_order_review (id, product_name, product_pcs, weight, company, product_type, single_price, box_price, discount, quantity, a_d_b_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [Id, productName, productPcs, Weight, Company, productType, single_price, box_price, discount, Quantity, a_d_b_price];

  con.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return res.status(500).send('Error inserting data into MySQL');
    }
    console.log('Data inserted into MySQL:', results);
    res.sendStatus(200);
  });
});

app.post('/your-endpoint', (req, res) => {
  const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "product"
  });
  const jsonData = req.body;
  console.log('Received JSON data:', jsonData);

  // Iterate over JSON data
  jsonData.forEach(item => {
      const companyName = item['Company'];
      const tableName = `${companyName}`; // Adjust the table naming convention as per your database structure

      // Check if the table exists
      const checkTableSql = `SHOW TABLES LIKE '${tableName}'`;
      con.query(checkTableSql, (err, result) => {
          if (err) {
              console.error('Error checking if table exists:', err);
              return;
          }

          if (result.length === 0) {
              console.error(`Table '${tableName}' does not exist.`);
              return;
          }

          // Check if single_price is not null
          if (item['Single Price'] === null) {
              console.error(`Error: 'single_price' cannot be null for item ${item['Id']}. Skipping insertion.`);
              return;
          }

          // Table exists and single_price is not null, insert data into it
          const sql = `INSERT INTO ${tableName} (product_id, product_name, product_pcs, weight, company, product_type, single_price, box_price, discount, quantity, a_d_b_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          const values = [item['Id'], item['Product Name'], item['Product Pcs'], item['Weight'], item['Company'], item['Product Type'], item['Single Price'], item['Box Price'], item['Discount'], item['Quantity'], item['A.D.B.Price']];

          con.query(sql, values, (err, result) => {
              if (err) {
                  console.error('Error inserting data:', err);
                  return;
              }
              console.log(`Inserted data into table '${tableName}' successfully`);

              // Delete all records from shop_product_order_review after successful insertion
              con.query("DELETE FROM shop_product_order_review", (err, result) => {
                  if (err) {
                      console.error('Error deleting data from shop_product_order_review:', err);
                      return;
                  }
                  console.log("Deleted all records from shop_product_order_review");
              });
          });
      });
  });

  res.sendStatus(200); // Sending back a success response
});



app.listen(port, () => {
  console.log(`Form server is listening on port ${port}`);
});
