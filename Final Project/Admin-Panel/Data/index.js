var mysql = require('mysql');
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "product"
});


const connection2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "yousufdbs"
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 8081;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/loging.html');
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const id = req.body.id;
  const password = req.body.password;

  // Query the database to check if the id and password match
  const query = `SELECT * FROM admin_information WHERE id = ? AND password = ?`;
  connection2.query(query, [id, password], (error, results) => {
      if (error) {
          console.error('Error querying database: ' + error.stack);
          res.status(500).send('Internal Server Error');
          return;
      }

      // If the query returned a result, the credentials are valid
      if (results.length > 0) {
          // Redirect to the dashboard page
          res.redirect('/Dash_Board_panel');
      } else {
          res.send('Invalid id or password');
      }
  });
});

app.get('/Dash_Board_panel', (req, res) => {
  res.sendFile(__dirname + '/Dash_Board_panel.html');
});;

app.get('/Data-Panel', function(req, res){
  res.sendFile(__dirname+'/Data-Panel.html');
});



app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');

    // Query to select data from production_prediction_database
    const selectQuery = 'SELECT * FROM `production_prediction_database` ORDER BY `product_id`';

    // Execute the select query
    connection.query(selectQuery, (error, results, fields) => {
        if (error) {
            console.error('Error executing select query: ' + error.stack);
            return;
        }

        // Loop through the results
        results.forEach((row) => {
          const ThisSeasonSales = row.ThisSeasonSales;
          const ThisMonthAllSales = row.ThisMonthAllSales;
          const ThisWeekAllSales = row.ThisWeekAllSales;
          const LastDaySales = row.LastDaySales;
          const PhysicalStock = row.PhysicalStock;
          const LastProductionQuantity = row.LastProductionQuantity;
      
          // Check condition before updating the database
          if (PhysicalStock === LastProductionQuantity && PhysicalStock >= LastProductionQuantity) {
              console.log(`Skipping update for id ${row.id} because PhysicalStock is equal to or greater than LastProductionQuantity`);
          } else {
              // Calculate production3
              const production3 = calculateProduction3(ThisSeasonSales, ThisMonthAllSales, ThisWeekAllSales, LastDaySales, LastProductionQuantity, PhysicalStock);
      
              // Update the database with production3
              const updateQuery = `UPDATE production_prediction_database SET ProductionPrediction = ${production3} WHERE id = ${row.id}`;
              connection.query(updateQuery, (updateError, updateResults, updateFields) => {
                  if (updateError) {
                      console.error('Error updating database: ' + updateError.stack);
                      return;
                  }
                  // console.log(`Updated ProductionPrediction for id ${row.id}`);
              });
          }
      });
    });
});

// Function to calculate 1valu based on LastDaySales
function calculate1valu(LastDaySales) {
    let oneValu;
    if (LastDaySales >= 450 && LastDaySales <= 599) {
      oneValu = 0;
    } else if (LastDaySales >= 600 && LastDaySales <= 699) {
      oneValu = 5;
    } else if (LastDaySales >= 700 && LastDaySales <= 799) {
      oneValu = 10;
    } else if (LastDaySales >= 800 && LastDaySales <= 900) {
      oneValu = 18;
    } else if (LastDaySales >= 900) {
      oneValu = 25;
    } else if (LastDaySales >= 449 && LastDaySales <= 300) {
      oneValu = -5;
    } else if (LastDaySales >= 299 && LastDaySales <= 200) {
      oneValu = -10;
    } else if (LastDaySales >= 199 && LastDaySales <= 100) {
      oneValu = -18;
    } else {
      oneValu = -25;
    }
    return oneValu;
  }
  
  // Function to calculate 2valu based on ThisWeekAllSales
  function calculate2valu(ThisWeekAllSales) {
    let twoValu;
    if (ThisWeekAllSales >= 3150 && ThisWeekAllSales <= 4193) {
      twoValu = 0;
    } else if (ThisWeekAllSales >= 4200 && ThisWeekAllSales <= 4900) {
      twoValu = 7;
    } else if (ThisWeekAllSales >= 4901 && ThisWeekAllSales <= 5600) {
      twoValu = 15;
    } else if (ThisWeekAllSales >= 5601 && ThisWeekAllSales <= 6300) {
      twoValu = 27;
    } else if (ThisWeekAllSales >= 6301) {
      twoValu = 37;
    } else if (ThisWeekAllSales >= 3149 && ThisWeekAllSales <= 2100) {
      twoValu = -7;
    } else if (ThisWeekAllSales >= 2099 && ThisWeekAllSales <= 1400) {
      twoValu = -15;
    } else if (ThisWeekAllSales >= 1399 && ThisWeekAllSales <= 700) {
      twoValu = -30;
    } else {
      twoValu = -37;
    }
    return twoValu;
  }
  
  // Function to calculate 3valu based on ThisMonthAllSales
  function calculate3valu(ThisMonthAllSales) {
    let threeValu;
    if (ThisMonthAllSales >= 13500 && ThisMonthAllSales <= 17999) {
      threeValu = 0;
    } else if (ThisMonthAllSales >= 18000 && ThisMonthAllSales <= 20999) {
      threeValu = 5;
    } else if (ThisMonthAllSales >= 21000 && ThisMonthAllSales <= 23999) {
      threeValu = 10;
    } else if (ThisMonthAllSales >= 24000 && ThisMonthAllSales <= 26999) {
      threeValu = 18;
    } else if (ThisMonthAllSales >= 27000) {
      threeValu = 25;
    } else if (ThisMonthAllSales >= 13499 && ThisMonthAllSales <= 9000) {
      threeValu = -5;
    } else if (ThisMonthAllSales >= 8999 && ThisMonthAllSales <= 6000) {
      threeValu = -10;
    } else if (ThisMonthAllSales >= 5999 && ThisMonthAllSales <= 3000) {
      threeValu = -18;
    } else {
      threeValu = -25;
    }
    return threeValu;
  }
  
  // Function to calculate 4valu based on ThisSeasonSales
  function calculate4valu(ThisSeasonSales) {
    let fourValu;
    if (ThisSeasonSales >= 27000 && ThisSeasonSales <= 35999) {
      fourValu = 0;
    } else if (ThisSeasonSales >= 36000 && ThisSeasonSales <= 41999) {
      fourValu = 2;
    } else if (ThisSeasonSales >= 42000 && ThisSeasonSales <= 47999) {
      fourValu = 5;
    } else if (ThisSeasonSales >= 48000 && ThisSeasonSales <= 53999) {
      fourValu = 9;
    } else if (ThisSeasonSales >= 54000) {
      fourValu = 12;
    } else if (ThisSeasonSales >= 26999 && ThisSeasonSales <= 18000) {
      fourValu = -2;
    } else if (ThisSeasonSales >= 17999 && ThisSeasonSales <= 12000) {
      fourValu = -5;
    } else if (ThisSeasonSales >= 11999 && ThisSeasonSales <= 6000) {
      fourValu = -9;
    } else {
      fourValu = -13;
    }
    return fourValu;
  }

// Function to calculate production2 based on the provided formula
function calculateProduction2(oneValu, twoValu, threeValu, fourValu, LastProductionQuantity) {
    const totalValu = oneValu + twoValu + threeValu + fourValu;
    const incrementPercentage = totalValu / 100;
    const production2 = LastProductionQuantity * (1 + incrementPercentage);
    return production2;
  }
  

// Function to calculate production3 based on the provided formula
function calculateProduction3(ThisSeasonSales, ThisMonthAllSales, ThisWeekAllSales, LastDaySales, LastProductionQuantity, PhysicalStock) {
    // Calculate each valu using respective functions
    const oneValu = calculate1valu(LastDaySales);
    const twoValu = calculate2valu(ThisWeekAllSales);
    const threeValu = calculate3valu(ThisMonthAllSales);
    const fourValu = calculate4valu(ThisSeasonSales);
    

    // Calculate production2
    const production2 = calculateProduction2(oneValu, twoValu, threeValu, fourValu, LastProductionQuantity);

    // Calculate production3
    const production3 = production2 - PhysicalStock; // Subtracting stock from production2
    return production3;
}

app.get('/Predection-report', function(req, res) {
    connection.query("SELECT * FROM production_prediction_database", function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/Predection-report", { production_prediction_database: result });
        }
    });
});







app.get('/Predection-report-search', function(req, res) {
    const { product_id, Name, Company } = req.query;
    const sql = "SELECT * FROM production_prediction_database WHERE product_id LIKE ? AND Name LIKE ? AND Company LIKE ?";
    const values = [`%${product_id}%`, `%${Name}%`, `%${Company}%`];

    connection.query(sql, values, function(error, result) {
        if (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render(__dirname + "/Predection-report", { production_prediction_database: result });
        }
    });
});





app.post('/production-repot-entry', function(req, res) {
  // SQL query to copy data from the first table to the second table
  const copyQuery = `
    INSERT INTO report_for_production (product_id, Name, weight, Company, PhysicalStock, productionQuantity) 
    SELECT product_id, Name, weight, Company, PhysicalStock, ProductionPrediction FROM production_prediction_database;
  `;

  // SQL query to update PhysicalStock by adding ProductionPrediction
  const updatePhysicalStockQuery = `
    UPDATE production_prediction_database 
    SET PhysicalStock = PhysicalStock + ProductionPrediction;
  `;

  // Execute the SQL query to copy data
  connection.query(copyQuery, function(err, result) {
    if (err) {
      console.error('Error copying data: ' + err.stack);
      res.status(500).send('Error copying data');
      return;
    }
    console.log('Data copied successfully!');

    // Execute the SQL query to update PhysicalStock
    connection.query(updatePhysicalStockQuery, function(updateErr, updateResult) {
      if (updateErr) {
        console.error('Error updating PhysicalStock: ' + updateErr.stack);
        res.status(500).send('Error updating PhysicalStock');
        return;
      }
      console.log('PhysicalStock updated successfully!');
      // Send success message in an event
      req.flash('success', 'Data copied and PhysicalStock updated successfully!');
      // Redirect to the home page
      res.redirect('/');
    });
  });
});





app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});