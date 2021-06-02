const knex = require("./../database");

class Restaurants {
  static async getAll(req, res) {
    knex
      .select("*") // select all records
      .from("businesses")
      .then((businesses) => {
        res.json(businesses);
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error retrieving businesses: ${err}`,
        });
      });
  }
}

module.exports = Restaurants;
