// Import necessary modules for database connection
const mysql = require('mysql');

// Define your database connection configuration
const dbConfig = {
    host: "localhost",
    user: "your_username",
    password: "your_password",
    database: "your_database"
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Function to insert sales metrics into production_prediction_database
function insertSalesMetricsIntoDatabase(salesMetrics) {
    // Acquire a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error acquiring MySQL connection:', err);
            // Handle error
            return;
        }

        // Define the SQL query to update production_prediction_database
        const sql = `
            UPDATE production_prediction_database
            SET
                LastYearSales = ?,
                LastSeasonSales = ?,
                ThisYearSales = ?,
                ThisSeasonSales = ?,
                LastDaySales = ?,
                ThisWeekAllSales = ?,
                ThisMonthAllSales = ?
            WHERE
                Name = ? AND
                weight = ? AND
                Company = ?
        `;

        // Execute the SQL query with the provided sales metrics
        connection.query(sql, [
            salesMetrics.LastYearSales,
            salesMetrics.LastSeasonSales,
            salesMetrics.ThisYearSales,
            salesMetrics.ThisSeasonSales,
            salesMetrics.LastDaySales,
            salesMetrics.ThisWeekAllSales,
            salesMetrics.ThisMonthAllSales,
            salesMetrics.productName,
            salesMetrics.weight,
            salesMetrics.companyName
        ], (err, result) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error updating production_prediction_database:', err);
                // Handle error
                return;
            }

            console.log('Updated production_prediction_database with sales metrics:', result);
        });
    });
}

// Example usage:
salesData.forEach(sale => {
    const salesMetrics = calculateSalesMetrics(sale);
    // Add productName, weight, and companyName to salesMetrics object
    salesMetrics.productName = sale.productName;
    salesMetrics.weight = sale.weight;
    salesMetrics.companyName = sale.companyName;

    // Insert sales metrics into production_prediction_database
    insertSalesMetricsIntoDatabase(salesMetrics);
});
