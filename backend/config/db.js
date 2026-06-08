const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectTimeout: 60000,
});

console.log("=== DATABASE CONFIG ===");
console.log("HOST:", process.env.MYSQLHOST);
console.log("USER:", process.env.MYSQLUSER);
console.log("DATABASE:", process.env.MYSQLDATABASE);
console.log("PORT:", process.env.MYSQLPORT);
console.log("=======================");

connection.connect((err) => {
  if (err) {
    console.error("❌ Gagal koneksi MySQL:", err);
    return;
  }

  console.log("✅ MySQL Connected!");
});

module.exports = connection;