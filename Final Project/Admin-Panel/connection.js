var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password:"",
  database: "yousufdbs"
});



// var con2 = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

module.exports = con;
// module.exports = con2;

// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password:"",
//   database: "yousufdbs"
// });


// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('MySQL connected');
  
//   // Create Table Query
//   const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS admin_Shop_id (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255),
//     person VARCHAR(255),
//     mobileNumber VARCHAR(20),
//     email VARCHAR(255),
//     address VARCHAR(255),
//     area VARCHAR(255),
//     nidNumber VARCHAR(50),
//     tradeLicense VARCHAR(50),
//     tinNumber VARCHAR(50),
//     type VARCHAR(255),
//     bankAccountName VARCHAR(255),
//     bankAccountNumber VARCHAR(50),
//     bankBranchName VARCHAR(255),
//     password VARCHAR(255),
//     photo VARCHAR(255)
//   )
//   `;
  
//   // Execute Table Creation Query
//   db.query(createTableQuery, (err, result) => {
//     if (err) {
//       throw err;
//     }
//     console.log('Users table created');
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
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
