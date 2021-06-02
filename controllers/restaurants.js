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

  static async createTableBooking(req, res) {
    knex("tableBookings")
      .insert({
        businessId: req.params.businessId,
        customerId: req.params.customerId,
        guestCount: req.body.guestCount,
        mobile: req.body.mobile,
        bookingDateTime: req.body.bookingDateTime,
        bookingStatus: 1,
      })
      .then((re) => {
        // Send a success message in response
        res.status(200).json({
          customerId: req.body.customerId,
          guestCount: req.body.guestCount,
          mobile: req.body.mobile,
          bookingDateTime: req.body.bookingDateTime,
        });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating table booking: ${req.params.customerId} with error: ${err}`,
        });
      });
  }

  static async addMenuItem(req, res) {
    knex("foodMenu")
      .insert({
        businessId: req.params.businessId,
        name: req.body.name,
        price: req.body.price,
        availabilityStatus: req.body.available,
      })
      .then((re) => {
        // Send a success message in response
        res.status(200).json({
          name: req.body.name,
          price: req.body.price,
          availabilityStatus: req.body.available,
        });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error adding food item: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async updateMenuItem(req, res) {
    knex("foodMenu")
      .where({ itemId: +req.params.itemId, businessId: +req.params.businessId })
      .update({
        name: req.body.name,
        price: req.body.price,
        availabilityStatus: req.body.available,
      })
      .then((re) => {
        // Send a success message in response
        res.status(200).json({
          name: req.body.name,
          price: req.body.price,
          availabilityStatus: req.body.available,
        });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error updating food item: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async deleteMenuItem(req, res) {
    knex("foodMenu")
      .where({ itemId: +req.params.itemId, businessId: +req.params.businessId })
      .del()
      .then((re) => {
        // Send a success message in response
        res.status(200).json({});
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error deleting food item: ${req.params.itemId} with error: ${err}`,
        });
      });
  }

  static async getMenu(req, res) {
    knex
      .select("*") // select all records
      .from("foodMenu")
      .where({ businessId: req.params.businessId })
      .then((menu) => {
        res.json(menu);
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error retrieving food menu: ${err}`,
        });
      });
  }
}

module.exports = Restaurants;
