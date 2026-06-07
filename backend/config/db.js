const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ekonomi_daerah",
});

connection.connect((err) => {
  if (err) {
    console.error("Gagal koneksi MySQL:", err);
    return;
  }
  console.log("MySQL Connected!");
});

module.exports = connection;