// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "", // your MySQL password
//   database: "product"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected to MySQL database!");

//   const sqlQuery = `
//     UPDATE production_prediction_database AS ppd
//     JOIN copmay_medicine_stock AS cms ON ppd.product_id = cms.id
//     SET ppd.PhysicalStock = cms.updateStock
//     SET ppd.LastProductionQuantity = cms.lastproduction
//   `;

//   // Executing the query
//   con.query(sqlQuery, function(err, results) {
//     if (err) {
//       console.error("Error updating PhysicalStock:", err.message);
//     } else {
//       console.log("PhysicalStock updated successfully");
//     }

//     // Closing the connection
//     con.end();
//   });
// });



var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "product"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database!");

  // Step 1: Copy data from product_sales_database to production_prediction_database
  var copyDataQuery = `
    INSERT INTO production_prediction_database (product_id, Name, weight, Company)
    SELECT id, productName, weight, companyName
    FROM product_sales_database;
  `;

  con.query(copyDataQuery, function(err, result) {
    if (err) throw err;
    console.log("Data copied successfully!");

    // Step 2: Calculate sales metrics
    var salesDataQuery = "SELECT sales_date, ProductCount FROM product_sales_database";
    con.query(salesDataQuery, function(err, rows) {
      if (err) throw err;

      // Function to convert sales date to year, month, week number, and season
      function convertSalesDate(salesDate) {
        const date = new Date(salesDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekNumber = Math.ceil(day / 7);
        let season = '';
        switch (month) {
          case 12:
          case 1:
          case 2:
            season = 'Winter Flu Season';
            break;
          case 6:
          case 7:
          case 8:
          case 9:
            season = 'Monsoon Season';
            break;
          case 2:
          case 3:
          case 4:
            season = 'Spring Allergies';
            break;
          case 5:
          case 6:
          case 7:
            season = 'Summer Allergies';
            break;
          case 8:
          case 9:
          case 10:
            season = 'Fall Allergies';
            break;
          case 4:
          case 5:
          case 6:
            season = 'Boro Harvest';
            break;
          case 10:
          case 11:
          case 12:
            season = 'Aman Harvest';
            break;
          case 3:
          case 4:
          case 5:
            season = 'Aus Harvest';
            break;
          case 12:
          case 1:
          case 2:
            season = 'Winter Allergies';
            break;
          case 4:
          case 5:
            season = 'Pre-monsoon Season';
            break;
          case 10:
          case 11:
            season = 'Post-monsoon Season';
            break;
          default:
            season = 'Unknown Season';
        }
        return {
          year,
          month,
          weekNumber,
          season
        };
      }

      // Function to calculate sales metrics
      function calculateSalesMetrics(salesData) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        const currentWeekNumber = Math.ceil(currentDay / 7);

        let ThisYearSales = 0;
        let ThisMonthAllSales = 0;
        let ThisSeasonSales = 0;
        let ThisWeekAllSales = 0;
        let LastDaySales = 0;
        let LastYearSales = 0;
        let LastSeasonSales = 0;

        salesData.forEach(sale => {
          const { year, month, weekNumber, season } = convertSalesDate(sale.sales_date);
          if (year === currentYear) {
            ThisYearSales += sale.ProductCount;
          }
          if (month === currentMonth) {
            ThisMonthAllSales += sale.ProductCount;
          }
          if (season === convertSeason(currentMonth)) {
            ThisSeasonSales += sale.ProductCount;
          }
          if (weekNumber === currentWeekNumber) {
            ThisWeekAllSales += sale.ProductCount;
          }
          if (sale.sales_date === currentDate.toISOString().slice(0, 10)) {
            LastDaySales += sale.ProductCount;
          }
          if (year === currentYear - 1) {
            LastYearSales += sale.ProductCount;
          }
          if (season === convertSeason(currentMonth) - 1) {
            LastSeasonSales += sale.ProductCount;
          }
        });

        return {
          ThisYearSales,
          ThisMonthAllSales,
          ThisSeasonSales,
          ThisWeekAllSales,
          LastDaySales,
          LastYearSales,
          LastSeasonSales
        };
      }

      // Function to convert month to season
      function convertSeason(month) {
        switch (month) {
          case 12:
          case 1:
          case 2:
            return 'Winter Flu Season';
          case 3:
          case 4:
          case 5:
            return 'Spring Allergies';
          case 6:
          case 7:
          case 8:
            return 'Summer Allergies';
          case 9:
          case 10:
          case 11:
            return 'Fall Allergies';
          default:
            return 'Unknown Season';
        }
      }

      // Calculate sales metrics
      var salesMetrics = calculateSalesMetrics(rows);

      // Step 3: Update production_prediction_database with sales metrics
      var updateMetricsQuery = `
        UPDATE production_prediction_database
        SET ThisYearSales = ${salesMetrics.ThisYearSales},
            ThisMonthAllSales = ${salesMetrics.ThisMonthAllSales},
            ThisSeasonSales = ${salesMetrics.ThisSeasonSales},
            ThisWeekAllSales = ${salesMetrics.ThisWeekAllSales},
            LastDaySales = ${salesMetrics.LastDaySales},
            LastYearSales = ${salesMetrics.LastYearSales},
            LastSeasonSales = ${salesMetrics.LastSeasonSales};
      `;

      con.query(updateMetricsQuery, function(err, result) {
        if (err) throw err;
        console.log("Sales metrics updated successfully!");

        // Step 4: Update production_prediction_database with PhysicalStock and LastProductionQuantity
        const updateStockQuery = `
          UPDATE production_prediction_database AS ppd
          JOIN copmay_medicine_stock AS cms ON ppd.product_id = cms.id
          SET ppd.PhysicalStock = cms.updateStock,
              ppd.LastProductionQuantity = cms.lastproduction;
        `;

        con.query(updateStockQuery, function(err, results) {
          if (err) {
            console.error("Error updating PhysicalStock:", err.message);
          } else {
            console.log("PhysicalStock and LastProductionQuantity updated successfully");
          }

          // Close connection
          con.end();
        });
      });
    });
  });
});
