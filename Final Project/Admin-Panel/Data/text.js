var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your MySQL password
  database: "product" // Change this to your database name
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL database!");

  // Check if the insert trigger exists before creating it
  con.query("SHOW TRIGGERS LIKE 'update_prediction_on_insert'", function(err, rows) {
    if (err) throw err;
    if (rows.length === 0) {
      // Create trigger to update production_prediction_database on insert
      var createInsertTrigger = `
        CREATE TRIGGER update_prediction_on_insert
        AFTER INSERT ON product_sales_database
        FOR EACH ROW
        BEGIN
            -- Insert or update the corresponding row in production_prediction_database
            INSERT INTO production_prediction_database (product_id, Name, weight, Company, LastDaySales, ThisWeekAllSales, ThisMonthAllSales, ThisYearSales, LastYearSales, LastSeasonSales)
            VALUES (NEW.id, NEW.productName, NEW.weight, NEW.companyName, 0, 0, 0, 0, 0, 0)
            ON DUPLICATE KEY UPDATE
            Name = NEW.productName,
            weight = NEW.weight,
            Company = NEW.companyName;
        END;
      `;

      con.query(createInsertTrigger, function(err, result) {
        if (err) throw err;
        console.log("Insert trigger created successfully!");
        console.log("Insert trigger: update_prediction_on_insert");
        
        // Check if the update trigger exists before creating it
        con.query("SHOW TRIGGERS LIKE 'update_prediction_on_update'", function(err, rows) {
          if (err) throw err;
          if (rows.length === 0) {
            // Create trigger to update production_prediction_database on update
            var createUpdateTrigger = `
              CREATE TRIGGER update_prediction_on_update
              AFTER UPDATE ON product_sales_database
              FOR EACH ROW
              BEGIN
                  -- Update the corresponding row in production_prediction_database
                  UPDATE production_prediction_database
                  SET Name = NEW.productName,
                      weight = NEW.weight,
                      Company = NEW.companyName
                  WHERE product_id = NEW.id;
              END;
            `;
        
            con.query(createUpdateTrigger, function(err, result) {
              if (err) throw err;
              console.log("Update trigger created successfully!");
              console.log("Update trigger: update_prediction_on_update");
              
              // Check if the sales metrics trigger exists before creating it
              con.query("SHOW TRIGGERS LIKE 'update_sales_metrics'", function(err, rows) {
                if (err) throw err;
                if (rows.length === 0) {
                  // Create trigger to calculate and update sales metrics in production_prediction_database
                  var createSalesMetricsTrigger = `
                    CREATE TRIGGER update_sales_metrics
                    AFTER INSERT ON product_sales_database
                    FOR EACH ROW
                    BEGIN
                        -- Calculate sales metrics
                        SET @ThisYearSales = 0;
                        SET @ThisMonthAllSales = 0;
                        SET @ThisSeasonSales = 0;
                        SET @ThisWeekAllSales = 0;
                        SET @LastDaySales = 0;
                        SET @LastYearSales = 0;
                        SET @LastSeasonSales = 0;
                        
                        SELECT 
                            SUM(CASE WHEN YEAR(sales_date) = YEAR(NOW()) THEN ProductCount ELSE 0 END) INTO @ThisYearSales,
                            SUM(CASE WHEN MONTH(sales_date) = MONTH(NOW()) THEN ProductCount ELSE 0 END) INTO @ThisMonthAllSales,
                            SUM(CASE WHEN YEAR(sales_date) = YEAR(NOW()) AND MONTH(sales_date) IN (3, 4, 5) THEN ProductCount ELSE 0 END) INTO @ThisSeasonSales,
                            SUM(CASE WHEN WEEK(sales_date) = WEEK(NOW()) THEN ProductCount ELSE 0 END) INTO @ThisWeekAllSales,
                            SUM(CASE WHEN DATE(sales_date) = CURDATE() THEN ProductCount ELSE 0 END) INTO @LastDaySales,
                            SUM(CASE WHEN YEAR(sales_date) = YEAR(NOW()) - 1 THEN ProductCount ELSE 0 END) INTO @LastYearSales,
                            SUM(CASE WHEN MONTH(sales_date) IN (MONTH(NOW()) - 3, MONTH(NOW()) - 2, MONTH(NOW()) - 1) THEN ProductCount ELSE 0 END) INTO @LastSeasonSales
                        FROM product_sales_database;
                        
                        -- Update sales metrics in production_prediction_database
                        UPDATE production_prediction_database
                        SET ThisYearSales = @ThisYearSales,
                            ThisMonthAllSales = @ThisMonthAllSales,
                            ThisSeasonSales = @ThisSeasonSales,
                            ThisWeekAllSales = @ThisWeekAllSales,
                            LastDaySales = @LastDaySales,
                            LastYearSales = @LastYearSales,
                            LastSeasonSales = @LastSeasonSales
                        WHERE product_id = NEW.id;
                    END;
                  `;
        
                  con.query(createSalesMetricsTrigger, function(err, result) {
                    if (err) throw err;
                    console.log("Sales metrics trigger created successfully!");
                    console.log("Sales metrics trigger: update_sales_metrics");
                  });
                } else {
                  console.log("Sales metrics trigger already exists.");
                  console.log("Sales metrics trigger: update_sales_metrics");
                }
              });
            });
          } else {
            console.log("Update trigger already exists.");
            console.log("Update trigger: update_prediction_on_update");
          }
        });
      });
    } else {
      console.log("Insert trigger already exists.");
      console.log("Insert trigger: update_prediction_on_insert");
    }
  });
});
