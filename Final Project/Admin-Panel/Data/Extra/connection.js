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







const express = require('express');
const mysql = require('mysql');

const app = express();

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "product"
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected');
  
  // Create Table Query
  var sql = `CREATE TABLE IF NOT EXISTS xyz1_shop (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_weight DECIMAL(10, 2) NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    shop_name VARCHAR(100) DEFAULT 'xyz1-shop',
    shop_area VARCHAR(50) DEFAULT 'Dhaka',
    price_per_pcs DECIMAL(10, 2) NOT NULL,
    shop_stock INT NOT NULL,
  )`;

  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Product panel table created');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







// // add more colume
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
//   const alterTableQuery = "ALTER TABLE production_prediction_database ADD id INT ";

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






// const mysql = require('mysql');

// // Create a connection to the MySQL database
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'product'
// });

// // Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL database: ' + err.stack);
//     return;
//   }
//   console.log('Connected to MySQL database');

//   // Define the ALTER TABLE statement
//   const alterTableQuery = `
//     ALTER TABLE production_prediction_database 
//     MODIFY COLUMN ProductCount VARCHAR(255) NOT NULL
//   `;

//   // Execute the ALTER TABLE statement
//   connection.query(alterTableQuery, (err, result) => {
//     if (err) {
//       console.error('Error altering table: ' + err.stack);
//       connection.end(); // Close the connection
//       return;
//     }
//     console.log('Table altered successfully');
    
//     // Close the connection
//     connection.end((err) => {
//       if (err) {
//         console.error('Error closing connection: ' + err.stack);
//         return;
//       }
//       console.log('Connection closed');
//     });
//   });
// });








// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');
// });

// // Define the SQL query to insert data into the products table
// const sql = `INSERT INTO copmay_medicine_stock (productName, productCount, weight, companyName, productType, updateStock) VALUES 
//   ('Widget A', 50, 2.5, 'ABC Inc.', 'Widget', 25),
//   ('Gadget B', 100, 1.8, 'XYZ Corp.', 'Gadget', 50),
//   ('Thingamajig C', 75, 3.2, '123 Industries', 'Thingamajig', 30)`;

// // Insert data into the Product table
// db.query(sql, (err, result) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Data inserted into the Product table');
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "", // your MySQL password
//   database: "product"
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');

//   // Execute the SQL command to retrieve a list of all triggers
//   db.query("SHOW TRIGGERS", (err, triggers) => {
//     if (err) {
//       throw err;
//     }
    
//     // Drop each trigger individually
//     triggers.forEach(trigger => {
//       const triggerName = trigger.Trigger;
//       db.query(`DROP TRIGGER IF EXISTS ${triggerName}`, (err, result) => {
//         if (err) {
//           console.error(`Error dropping trigger ${triggerName}:`, err.message);
//         } else {
//           console.log(`Trigger ${triggerName} dropped successfully`);
//         }
//       });
//     });
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "", // your MySQL password
//   database: "product"
// });

// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');

//   // Execute the SQL command to show triggers
//   db.query("SHOW TRIGGERS", (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log('Triggers:');
//     console.log(result); // Print the result of SHOW TRIGGERS
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });