const path = require("path");

// Get the location of database.sqlite file
const dbPath = path.resolve(__dirname, "database/database.sqlite");

// Create connection to SQLite database
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

// Create a table in the database called "users"
knex.schema
  // Make sure no "users" table exists
  // before trying to create new
  .hasTable("users")
  .then((exists) => {
    if (!exists) {
      // If no "users" table exists
      // create new, with "userId", "name", "email",
      // "password" columns
      // and use "userId" as a primary identification
      // and increment "userId" with every new record (user)
      return knex.schema
        .createTable("users", (table) => {
          table.increments("userId").primary();
          table.string("name");
          table.string("email");
          table.string("password");
          table.string("mobile");
        })
        .then(() => {
          // Log success message
          console.log("Table 'Users' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    // Log success message
    // console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

// Just for debugging purposes:
// Log all data in "users" table
// knex
//   .select("*")
//   .from("users")
//   .then((data) => console.log("data:", data))
//   .catch((err) => console.log(err));

// Export the database
module.exports = knex;
