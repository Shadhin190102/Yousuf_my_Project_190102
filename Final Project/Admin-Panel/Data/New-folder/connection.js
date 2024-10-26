// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password:"",
//   database: "yousufdbs"
// });



// // var con2 = mysql.createConnection({
// //   host: "localhost",
// //   user: "root",
// //   password: "",
// //   database: "product"
// // });

// module.exports = con;
// module.exports = con2;





















// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// // Middleware for parsing JSON bodies
// app.use(express.json());

// // Create a MySQL connection pool
// const db = mysql.createPool({
//   connectionLimit: 10,
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to MySQL and create the table if it doesn't exist
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('MySQL connected');

//   // Create Table Query
//   const sql = `CREATE TABLE IF NOT EXISTS production_prediction_database (
// product_id INT PRIMARY KEY,
//     Name VARCHAR(255) NOT NULL,
//     weight FLOAT NOT NULL,
//     Company VARCHAR(255) NOT NULL,
//     LastYearSales INT NOT NULL,
//     LastSeasonSales INT NOT NULL,
//     ThisYearSales INT NOT NULL,
//     ThisSeasonSales INT NOT NULL,
//     LastDaySales INT NOT NULL,
//     ThisWeekAllSales INT NOT NULL,
//     ThisMonthAllSales INT NOT NULL,
//     LastProductionQuantity INT NOT NULL,
//     PhysicalStock INT NOT NULL,
//     ProductionPrediction INT NOT NULL
//   )`;

//   connection.query(sql, (err, result) => {
//     connection.release(); // Release the connection back to the pool

//     if (err) {
//       console.error('Error creating table:', err);
//       return;
//     }
//     console.log('Product panel table created');
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Handle any unexpected errors gracefully
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
//   process.exit(1);
// });





// Start the server


// const mysql = require('mysql');

// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to the database
// connection.connect(err => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return;
//     }
//     console.log('Connected to the database as id', connection.threadId);
// });

// // List of disease tests to insert
// const diseaseTests = [
//   { testGroup: 'Other Common Tests', testName: 'Bone Density Test (DEXA)' },
//   { testGroup: 'Other Common Tests', testName: 'Skin Biopsy' },
//   { testGroup: 'Other Common Tests', testName: 'Urine Culture' },
//   { testGroup: 'Other Common Tests', testName: 'Stool Test (Occult Blood)' },
//   { testGroup: 'Other Common Tests', testName: 'H. Pylori Test' },
//   { testGroup: 'Other Common Tests', testName: 'Hormone Tests (e.g., Cortisol, Testosterone, Estrogen)' },
//   { testGroup: 'Other Common Tests', testName: 'Throat Culture' },
//   { testGroup: 'Other Common Tests', testName: 'Sputum Culture' },
//   { testGroup: 'Other Common Tests', testName: 'Cholesterol Test' },
//   { testGroup: 'Other Common Tests', testName: 'Thyroid Stimulating Hormone (TSH) Test' },
//   { testGroup: 'Other Common Tests', testName: 'Calcium Blood Test' },
//   { testGroup: 'Other Common Tests', testName: 'Magnesium Blood Test' },
//   { testGroup: 'Other Common Tests', testName: 'Phosphate Blood Test' },
//   { testGroup: 'Other Common Tests', testName: 'Ferritin Blood Test' },
//   { testGroup: 'Other Common Tests', testName: 'Iron Blood Test' },
//   { testGroup: 'Other Common Tests', testName: 'Vitamin B12 Test' },
//   { testGroup: 'Other Common Tests', testName: 'Folate Test' },
//   { testGroup: 'Other Common Tests', testName: 'C-Reactive Protein (CRP) Test' },
//   { testGroup: 'Other Common Tests', testName: 'Sedimentation Rate (ESR) Test' },
//   { testGroup: 'Other Common Tests', testName: 'Lactate Dehydrogenase (LDH) Test' }
// ];

// // SQL query to insert the data
// const insertQuery = 'INSERT INTO disease_problems (disease_name) VALUES ?';

// // Prepare data for insertion
// const values = diseaseTests.map(test => [test.testGroup, test.testName]);

// // Execute the query
// connection.query(insertQuery, [values], (err, results) => {
//     if (err) {
//         console.error('Error inserting data:', err.stack);
//         return;
//     }
//     console.log('Data inserted successfully:', results.affectedRows, 'rows');
// });

// // Close the connection
// connection.end();




// const mysql = require('mysql');

// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to database');
// });

// // Array of problems
// const problems = [
//   'Headaches',

// 'Tremors Movement)',
// 'Periods Concentrating',
// 'Obsessions Obsessions',
// 'Hoarding',
// 'Hallucinations',
// 'Delusions',
// 'Disorganized Functioning'
// ];

// // Insert each problem into the database
// problems.forEach((problem) => {
//   connection.query('INSERT INTO disease_problems (disease_name) VALUES (?)', [problem], (error, results, fields) => {
//     if (error) {
//       console.error('Error inserting problem:', error);
//       return;
//     }
//     console.log('Inserted problem:', problem);
//   });
// });

// // Close the connection
// connection.end();















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













// const express = require('express');
// const mysql = require('mysql');

// const app = express();

// var db = mysql.createConnection({
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
  
//   // Create Table Query
 
//   // Execute Table Creation Query


//     // Insert Sample Data
//     const insertDataQuery = `
//       INSERT INTO xyzshop (product_id, productName, weight, productType, companyName, PhysicalStock, price)
//       VALUES 
//       (101, 'Product A', 100, 'Type A', 'Company A', 50, 100),
//       (102, 'Product B', 150, 'Type B', 'Company B', 75, 150),
//       (103, 'Product C', 200, 'Type C', 'Company C', 100, 200)
//     `;
  
//     // Execute Data Insertion Query
//     db.query(insertDataQuery, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       console.log('Sample data inserted into xyzshop table');
//     });
//   });

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





// const mysql = require('mysql');

// // Create a connection to the database
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "product"
// });

// // Connect to the database
// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//     return;
//   }
//   console.log('MySQL connected');

//   // Insert data into the table
//   const data = [
//     ['P001', 'Product 1', 1.50, 'Type A', 'Company A', 10.00, 100],
//     ['P002', 'Product 2', 2.00, 'Type B', 'Company B', 20.00, 200]
//   ];

//   const sql = 'INSERT INTO xyz1_shop (product_code, product_name, product_weight, product_type, company_name, price_per_pcs, shop_stock) VALUES ?';

//   db.query(sql, [data], (err, result) => {
//     if (err) {
//       console.error('Error inserting data:', err);
//       return;
//     }
//     console.log('Data inserted:', result.affectedRows);
//   });

//   // Close the database connection
//   db.end((err) => {
//     if (err) {
//       console.error('Error closing connection:', err);
//       return;
//     }
//     console.log('Connection closed');
//   });
// });



const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'product'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');

  // List of drop trigger statements
  const dropTriggers = [
    "DROP TRIGGER IF EXISTS after_xyz1_insert",
    "DROP TRIGGER IF EXISTS after_xyz1_update",
    "DROP TRIGGER IF EXISTS after_xyz2_insert",
    "DROP TRIGGER IF EXISTS after_xyz2_update"
  ];

  // Execute each drop trigger statement separately
  dropTriggers.forEach(dropTrigger => {
    connection.query(dropTrigger, (err, results) => {
      if (err) {
        console.error('Error dropping trigger: ', err.sqlMessage);
        return;
      }
      console.log('Trigger dropped successfully');
    });
  });
});

// Close the connection gracefully
process.on('SIGINT', () => {
  connection.end(err => {
    if (err) {
      console.error('Error closing MySQL connection: ', err);
    } else {
      console.log('MySQL connection closed');
    }
    process.exit();
  });
});

