const express = require('express');
const mysql = require('mysql');

const app = express();

// Create a connection to the MySQL database
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "product"
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return; // Stop execution if there's an error connecting to the database
  }
  console.log('MySQL connected');
  
  // Define usedProductIds outside the loop
  var usedProductIds = {};

  // Insert 100 records with random data
  for (let i = 1; i <= 100; i++) {
    // Generate random values for each field
    var product_id;
    var name = `Product ${i}`;
    var weight = Math.random() * 20 + 5;
    var company = `Company ${i}`;
    var lastYearSales = Math.random() * 2000 + 500;
    var lastSeasonSales = Math.random() * 1000 + 200;
    var thisYearSales = Math.random() * 3000 + 1000;
    var thisSeasonSales = Math.random() * 1500 + 500;
    var lastDaySales = Math.random() * 500;
    var thisWeekAllSales = Math.random() * 300;
    var thisMonthAllSales = Math.random() * 800;
    var physicalStock = Math.floor(Math.random() * 700) + 1;
    var productionPrediction = Math.random() * 1000;

    // Combine name and weight to create a unique key for product_id generation
    var key = name + weight;
    if (usedProductIds[key]) {
        // If name + weight combination already exists, use the same product_id
        product_id = usedProductIds[key];
    } else {
        // Generate a new product_id
        product_id = i;
        // Store the product_id for this name + weight combination
        usedProductIds[key] = product_id;
    }

    // SQL query to insert data into the database
    var sql = `INSERT INTO production_prediction_database (product_id, Name, weight, Company, LastYearSales, LastSeasonSales, ThisYearSales, ThisSeasonSales, LastDaySales, ThisWeekAllSales, ThisMonthAllSales, PhysicalStock, ProductionPrediction) VALUES 
      (${product_id}, '${name}', ${weight}, '${company}', ${lastYearSales}, ${lastSeasonSales}, ${thisYearSales}, ${thisSeasonSales}, ${lastDaySales}, ${thisWeekAllSales}, ${thisMonthAllSales}, ${physicalStock}, ${productionPrediction})`;

    // Execute the SQL query
    db.query(sql, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return; // Stop processing this query, but keep the server running
      }
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

