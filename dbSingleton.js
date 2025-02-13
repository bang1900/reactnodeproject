/**
 * dbSingleton.js
 *
 * This module manages the MySQL database connection as a singleton.
 * It ensures that only **one connection instance** is created and reused
 * throughout the application, preventing multiple unnecessary connections.
 *
 * Features:
 * - Uses `mysql2` for MySQL database interactions.
 * - Implements a **singleton pattern** to manage a single connection.
 * - Automatically reconnects if the connection is lost.
 */

const mysql = require("mysql2"); // Import MySQL2 for database connection

let connection; // Store the single database connection instance

const dbSingleton = {
  /**
   * getConnection()
   * - Establishes and returns a single database connection instance.
   * - If a connection already exists, it returns the existing connection.
   * - If no connection exists, it creates a new one.
   *
   * @returns {object} MySQL database connection
   */
  getConnection: () => {
    if (!connection) {
      // Check if a connection already exists
      connection = mysql.createConnection({
        host: "localhost", // Database host (default: localhost)
        user: "root", // MySQL username (ensure correct user)
        password: "", // MySQL password (update if applicable)
        database: "statues_DB", // ✅ Ensure this is the correct database name
      });

      // Establish connection to the database
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to database:", err);
          throw err; // Exit if connection fails
        }
        console.log("Connected to MySQL!"); // Log success
      });

      // Handle potential database connection errors
      connection.on("error", (err) => {
        console.error("Database connection error:", err);

        // If the connection is lost, reset the connection instance
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          connection = null;
        }
      });
    }
    return connection; // Return the database connection instance
  },
};

module.exports = dbSingleton; // Export the singleton connection manager
