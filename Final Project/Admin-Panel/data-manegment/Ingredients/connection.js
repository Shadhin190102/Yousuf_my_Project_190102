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

var mysql = require('mysql');

// Create a connection to the MySQL database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "product"
});

// Connect to the database
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database.");

  // SQL query to create the table
  var sql = `CREATE TABLE IF NOT EXISTS new_ingredient_final (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(255),
    weight VARCHAR(255),
    ingredient_type VARCHAR(255),
    sub_ingredient_name VARCHAR(255),
    problems JSON,
    main_conditions JSON,
    warnings JSON
  )`;

  // Execute the SQL query
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table 'ingredient_info' created successfully.");
  });
});





















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

// // Create a connection to the MySQL database
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to the database
// con.connect(function(err) {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to the database');

//   // Execute the SQL query to copy the table
//   var sql = "CREATE TABLE panel_data SELECT * FROM ingredient_info";
//   con.query(sql, function(err, result) {
//     if (err) {
//       console.error('Error copying table:', err);
//     } else {
//       console.log('Table copied successfully');
//     }

//     // Close the connection
//     con.end(function(err) {
//       if (err) {
//         console.error('Error closing connection:', err);
//       } else {
//         console.log('Connection closed');
//       }
//     });
//   });
// });
