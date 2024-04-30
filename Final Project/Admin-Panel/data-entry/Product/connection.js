// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password:"",
//   database: "yousufdbs"
// });



// var con2 = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// module.exports = con;
// module.exports = con2;







// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password:"",
//   database: "product"
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');
  
//   // Create Table Query
//   var sql = `CREATE TABLE IF NOT EXISTS product_panel_database (
//      id INT AUTO_INCREMENT PRIMARY KEY,
//      productName VARCHAR(255) NOT NULL,
//      ProductCount VARCHAR(255) NOT NULL,
//      productType ENUM('solid', 'liquid', 'gas') NOT NULL,
//      ingredients TEXT NOT NULL,
//      diseaseName VARCHAR(255) NOT NULL,
//      weight VARCHAR(50) NOT NULL,
//      companyName VARCHAR(255) NOT NULL,
//      age VARCHAR(50) NOT NULL,
//      price DECIMAL(10, 2) NOT NULL,
//      discount DECIMAL(10, 2),
//      publishedDate DATE NOT NULL,
//      productDetails TEXT,
//      photo VARCHAR(255)
//   )`;

//   db.query(sql, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log('Product panel table created');
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });







// add more colume
// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// // Create a MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');

//   // SQL statement to add a new column to an existing table
//   const alterTableQuery = "ALTER TABLE product_database ADD ProductCount VARCHAR(255)";

//   // Execute the ALTER TABLE query
//   db.query(alterTableQuery, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log('New column added to the table');
//   });
// });

// app.listen(8081, () => {
//   console.log('Server is running on port 8081');
// });




// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password:"",
//   database: "product"
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');

//   // Alter the table structure to change the position of the productCount column
//   const alterQuery = "ALTER TABLE product_database MODIFY COLUMN diseaseName INT AFTER ingredients";

//   db.query(alterQuery, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log("Table structure altered successfully!");
//   });
// });










// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to the database
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to the database");

//   // Define the ALTER TABLE query to add new columns
//   var alterQuery = "ALTER TABLE ingredient_info " +
//                    "ADD COLUMN details VARCHAR(500), " +
//                    "ADD COLUMN photo VARCHAR(255)";

//   // Execute the ALTER TABLE query
//   con.query(alterQuery, function(err, result) {
//     if (err) throw err;
//     console.log("Table altered successfully");
    
//     // Close the connection
//     con.end(function(err) {
//       if (err) throw err;
//       console.log("Connection closed");
//     });
//   });
// });






// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to the database
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to the database");

//   // Define the DROP TABLE query
//   var dropQuery = "DROP TABLE IF EXISTS product_panel_database";

//   // Execute the DROP TABLE query
//   con.query(dropQuery, function(err, result) {
//     if (err) throw err;
//     console.log("Table dropped successfully");

//     // Close the connection
//     con.end(function(err) {
//       if (err) throw err;
//       console.log("Connection closed");
//     });
//   });
// });






const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');

  // Define the ALTER TABLE statement
  const alterTableQuery = `
    ALTER TABLE product_database 
    MODIFY COLUMN ProductCount VARCHAR(255) NOT NULL
  `;

  // Execute the ALTER TABLE statement
  connection.query(alterTableQuery, (err, result) => {
    if (err) {
      console.error('Error altering table: ' + err.stack);
      connection.end(); // Close the connection
      return;
    }
    console.log('Table altered successfully');
    
    // Close the connection
    connection.end((err) => {
      if (err) {
        console.error('Error closing connection: ' + err.stack);
        return;
      }
      console.log('Connection closed');
    });
  });
});
