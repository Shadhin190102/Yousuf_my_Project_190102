// const express = require('express');
// const mysql = require('mysql');

// const app = express();
// const port = 3000;

// // MySQL Connection
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "product"
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to database: ' + err.stack);
//         return;
//     }
//     console.log('Connected to database as id ' + connection.threadId);
// });

// // Initial Copy Route
// app.get('/initialcopy', (req, res) => {
//     const initialCopyQuery = `
//         INSERT INTO all_shop_stock (product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock)
//         SELECT product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock FROM xyz1_shop;
        
//         INSERT INTO all_shop_stock (product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock)
//         SELECT product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock FROM xyz_shop2;
//     `;
//     connection.query(initialCopyQuery, (error, results, fields) => {
//         if (error) throw error;
//         res.send('Initial copy successful!');
//     });
// });

// // Triggers for INSERT, UPDATE, DELETE from xyz1_shop to all_shop_stock
// connection.query(`
//     CREATE TRIGGER after_insert_xyz1_shop 
//     AFTER INSERT ON xyz1_shop 
//     FOR EACH ROW 
//     BEGIN 
//         INSERT INTO all_shop_stock (product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock) 
//         VALUES (NEW.product_code, NEW.product_name, NEW.product_weight, NEW.product_type, NEW.company_name, NEW.shop_name, NEW.shop_area, NEW.price, NEW.shop_stock); 
//     END;
// `, (error, results, fields) => {
//     if (error) throw error;
//     console.log('Trigger for INSERT from xyz1_shop to all_shop_stock created successfully');
// });

// connection.query(`
//     CREATE TRIGGER after_update_xyz1_shop 
//     AFTER UPDATE ON xyz1_shop 
//     FOR EACH ROW 
//     BEGIN 
//         UPDATE all_shop_stock 
//         SET product_name = NEW.product_name, 
//             product_weight = NEW.product_weight, 
//             product_type = NEW.product_type, 
//             company_name = NEW.company_name, 
//             shop_name = NEW.shop_name, 
//             shop_area = NEW.shop_area, 
//             price = NEW.price, 
//             shop_stock = NEW.shop_stock 
//         WHERE all_shop_stock.product_code = OLD.product_code; 
//     END;
// `, (error, results, fields) => {
//     if (error) throw error;
//     console.log('Trigger for UPDATE from xyz1_shop to all_shop_stock created successfully');
// });

// connection.query(`
//     CREATE TRIGGER after_delete_xyz1_shop 
//     AFTER DELETE ON xyz1_shop 
//     FOR EACH ROW 
//     BEGIN 
//         DELETE FROM all_shop_stock 
//         WHERE all_shop_stock.product_code = OLD.product_code; 
//     END;
// `, (error, results, fields) => {
//     if (error) throw error;
//     console.log('Trigger for DELETE from xyz1_shop to all_shop_stock created successfully');
// });

// // Triggers for INSERT, UPDATE, DELETE from xyz_shop2 to all_shop_stock
// connection.query(`
//     CREATE TRIGGER after_insert_xyz_shop2 
//     AFTER INSERT ON xyz_shop2 
//     FOR EACH ROW 
//     BEGIN 
//         INSERT INTO all_shop_stock (product_code, product_name, product_weight, product_type, company_name, shop_name, shop_area, price, shop_stock) 
//         VALUES (NEW.product_code, NEW.product_name, NEW.product_weight, NEW.product_type, NEW.company_name, NEW.shop_name, NEW.shop_area, NEW.price, NEW.shop_stock); 
//     END;
// `, (error, results, fields) => {
//     if (error) throw error;
//     console.log('Trigger for INSERT from xyz_shop2 to all_shop_stock created successfully');
// });

// connection.query(`
//     CREATE TRIGGER after_update_xyz_shop2 
//     AFTER UPDATE ON xyz_shop2 
//     FOR EACH ROW 
//     BEGIN 
//         UPDATE all_shop_stock 
//         SET product_name = NEW.product_name, 
//             product_weight = NEW.product_weight, 
//             product_type = NEW.product_type, 
//             company_name = NEW.company_name, 
//             shop_name = NEW.shop_name, 
//             shop_area = NEW.shop_area, 
//             price = NEW.price, 
//             shop_stock = NEW.shop_stock 
//         WHERE all_shop_stock.product_code = OLD.product_code; 
//     END;
// `, (error, results, fields) => {
//     if (error) throw error;
//     console.log('Trigger for UPDATE from xyz_shop2 to all_shop_stock created successfully');
// });

// connection.query(`
//     CREATE TRIGGER after_delete_xyz_shop2 
//     AFTER DELETE ON xyz_shop2 
//     FOR EACH ROW 
//     BEGIN 
//         DELETE FROM all_shop_stock 
//         WHERE all_shop_stock.product_code = OLD.product_code; 
//     END;
// `, (error, results, fields) => {
//     if (error) throw error;
//     console.log('Trigger for DELETE from xyz_shop2 to all_shop_stock created successfully');
// });

// app.listen(port, () => {
//     console.log(`App listening at http://localhost:${port}`);
// });






































const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// Route to delete all triggers
app.get('/deletetriggers', (req, res) => {
    const deleteTriggerQuery = `
        DROP TRIGGER IF EXISTS after_insert_xyz1_shop;
        DROP TRIGGER IF EXISTS after_update_xyz1_shop;
        DROP TRIGGER IF EXISTS after_delete_xyz1_shop;
        DROP TRIGGER IF EXISTS after_insert_xyz_shop2;
        DROP TRIGGER IF EXISTS after_update_xyz_shop2;
        DROP TRIGGER IF EXISTS after_delete_xyz_shop2;
    `;
    connection.query(deleteTriggerQuery, (error, results, fields) => {
        if (error) throw error;
        res.send('Triggers deleted successfully!');
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});