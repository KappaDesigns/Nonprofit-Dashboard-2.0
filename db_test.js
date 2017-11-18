//temp root password .tWryD0UEgMl
const MYSQL = require('mysql');

const Connection = MYSQL.createConnection({
    host:"localhost",
    user: "root",
    password: ".tWryD0UEgMl",
});

Connection.connect(function handleConnection(err) {
    if (err) {
        // Error Connecting to MYSQL DB
        throw err;
    }
    console.log(`Successfully Connected To Database.`);
});