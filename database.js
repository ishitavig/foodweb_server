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

// Create a table in the database called "customers"
knex.schema
  // Make sure no "customers" table exists
  // before trying to create new
  .hasTable("customers")
  .then((exists) => {
    if (!exists) {
      // If no "customers" table exists
      // create new columns
      // and use "customerId" as a primary identification
      // and increment "customerId" with every new record (user)
      return knex.schema
        .createTable("customers", (table) => {
          table.increments("customerId").primary();
          table.string("name");
          table.string("email");
          table.string("password");
          table.integer("mobile");
        })
        .then(() => {
          // Log success message
          console.log("Table 'customers' created");
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

// Create a table in the database called "adPlans"
knex.schema
  // Make sure no "adPlans" table exists
  // before trying to create new
  .hasTable("adPlans")
  .then((exists) => {
    if (!exists) {
      // If no "adPlans" table exists
      // create new columns
      // and use "planId" as a primary identification
      // and increment "planId" with every new record (business)
      return knex.schema
        .createTable("adPlans", (table) => {
          table.increments("planId").primary();
          table.string("name");
          table.integer("periodInDays");
          table.integer("status");
        })
        .then(() => {
          // Log success message
          console.log("Table 'adPlans' created");
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

// Create a table in the database called "businesses"
knex.schema
  // Make sure no "businesses" table exists
  // before trying to create new
  .hasTable("businesses")
  .then((exists) => {
    if (!exists) {
      // If no "businesses" table exists
      // create new columns
      // and use "businessId" as a primary identification
      // and increment "businessId" with every new record (business)
      return knex.schema
        .createTable("businesses", (table) => {
          table.increments("businessId").primary();
          table.string("name");
          table.string("email");
          table.string("password");
          table.integer("mobile");
          table.string("ABN");
          table.string("billingId");
          table.integer("planId").references("planId").inTable("adPlans");
          table.integer("tableBookingStatus");
          table.integer("foodOrderStatus");
          table.string("address");
          table.timestamp("openingHoursFrom");
          table.timestamp("openingHoursTo");
          table.integer("rating");
        })
        .then(() => {
          // Log success message
          console.log("Table 'businesses' created");
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

// Create a table in the database called "businessAds"
knex.schema
  // Make sure no "businessAds" table exists
  // before trying to create new
  .hasTable("businessAds")
  .then((exists) => {
    if (!exists) {
      // If no "businessAds" table exists
      // create new columns
      // and use "adId" as a primary identification
      // and increment "adId" with every new record (business)
      return knex.schema
        .createTable("businessAds", (table) => {
          table.increments("adId").primary();
          table
            .integer("businessId")
            .references("businessId")
            .inTable("businesses");
          table.string("heading");
          table.string("text");
          table.timestamp("startDate");
          table.timestamp("endDate");
          table.integer("visibilityStatus");
          table.integer("planId").references("planId").inTable("adPlans");
        })
        .then(() => {
          // Log success message
          console.log("Table 'businessAds' created");
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

// Create a table in the database called "blogs"
knex.schema
  // Make sure no "blogs" table exists
  // before trying to create new
  .hasTable("blogs")
  .then((exists) => {
    if (!exists) {
      // If no "blogs" table exists
      // create new columns
      // and use "blogId" as a primary identification
      // and increment "blogId" with every new record (business)
      return knex.schema
        .createTable("blogs", (table) => {
          table.increments("blogId").primary();
          table
            .integer("customerId")
            .references("customerId")
            .inTable("customers");
          table
            .integer("businessId")
            .references("businessId")
            .inTable("businesses");
          table.string("heading");
          table.string("content");
          table.timestamp("postedOn");
          table.integer("visibilityStatus");
        })
        .then(() => {
          // Log success message
          console.log("Table 'blogs' created");
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

// Create a table in the database called "tableBookings"
knex.schema
  // Make sure no "tableBookings" table exists
  // before trying to create new
  .hasTable("tableBookings")
  .then((exists) => {
    if (!exists) {
      // If no "tableBookings" table exists
      // create new columns
      // and use "bookingId" as a primary identification
      // and increment "bookingId" with every new record (business)
      return knex.schema
        .createTable("tableBookings", (table) => {
          table.increments("bookingId").primary();
          table
            .string("businessId")
            .references("businessId")
            .inTable("businesses");
          table
            .string("customerId")
            .references("customerId")
            .inTable("customers");
          table.integer("guestCount");
          table.integer("mobile");
          table.timestamp("bookingDateTime");
          table.integer("bookingStatus");
        })
        .then(() => {
          // Log success message
          console.log("Table 'tableBookings' created");
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

// Create a table in the database called "foodMenu"
knex.schema
  // Make sure no "foodMenu" table exists
  // before trying to create new
  .hasTable("foodMenu")
  .then((exists) => {
    if (!exists) {
      // If no "foodMenu" table exists
      // create new columns
      // and use "itemId" as a primary identification
      // and increment "itemId" with every new record (business)
      return knex.schema
        .createTable("foodMenu", (table) => {
          table.increments("itemId").primary();
          table.string("name");
          table
            .integer("businessId")
            .references("businessId")
            .inTable("businesses");
          table.integer("availabilityStatus");
          table.integer("price");
        })
        .then(() => {
          // Log success message
          console.log("Table 'foodMenu' created");
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

// Create a table in the database called "foodOrders"
knex.schema
  // Make sure no "foodOrders" table exists
  // before trying to create new
  .hasTable("foodOrders")
  .then((exists) => {
    if (!exists) {
      // If no "foodOrders" table exists
      // create new columns
      // and use "orderId" as a primary identification
      // and increment "orderId" with every new record (business)
      return knex.schema
        .createTable("foodOrders", (table) => {
          table.increments("orderId").primary();
          table
            .integer("businessId")
            .references("businessId")
            .inTable("businesses");
          table
            .integer("customerId")
            .references("customerId")
            .inTable("customers");
          table.integer("billingCost");
          table.string("address");
          table.integer("mobile");
        })
        .then(() => {
          // Log success message
          console.log("Table 'foodOrders' created");
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

// Create a table in the database called "itemOrders"
knex.schema
  // Make sure no "itemOrders" table exists
  // before trying to create new
  .hasTable("itemOrders")
  .then((exists) => {
    if (!exists) {
      // If no "itemOrders" table exists
      // create new columns
      // and use "orderId, itemId" as a primary identification
      return knex.schema
        .createTable("itemOrders", (table) => {
          table
            .increments("orderId")
            .references("orderId")
            .inTable("foodOrders");
          table.integer("itemId").references("itemId").inTable("foodMenu");
          table.unique(["orderId", "itemId"]);
        })
        .then(() => {
          // Log success message
          console.log("Table 'itemOrders' created");
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
