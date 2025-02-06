const mysql = require("mysql2");

let connection;

const dbSingleton = {
  getConnection: () => {
    if (!connection) {
      connection = mysql.createConnection({
        host: "localhost", // Ensure this is correct
        user: "root", // Use your MySQL username
        password: "", // Use your MySQL password if applicable
        database: "statues_DB", // ✅ CHANGE THIS TO THE CORRECT DATABASE
      });

      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to database:", err);
          throw err;
        }
        console.log("Connected to MySQL!");
      });

      connection.on("error", (err) => {
        console.error("Database connection error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          connection = null; // Reset connection
        }
      });
    }
    return connection;
  },
};

module.exports = dbSingleton;
