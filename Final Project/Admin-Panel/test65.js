const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // List triggers
  listTriggers();
});

// Function to list triggers
function listTriggers() {
  connection.query('SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_STATEMENT FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = ?', ['your_database_name'], (err, results) => {
    if (err) {
      console.error('Error listing triggers:', err);
      return;
    }
    console.log('Existing Triggers:');
    results.forEach((row) => {
      console.log(`Name: ${row.TRIGGER_NAME}, Event: ${row.EVENT_MANIPULATION}, Table: ${row.EVENT_OBJECT_TABLE}, Action: ${row.ACTION_STATEMENT}`);
    });
    connection.end();
  });
}
