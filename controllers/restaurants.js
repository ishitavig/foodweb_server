const knex = require("./../database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
        itemName: req.body.name,
        price: req.body.price,
        availabilityStatus: req.body.availabilityStatus,
      })
      .then((re) => {
        // Send a success message in response
        res.status(200).json({
          name: req.body.name,
          price: req.body.price,
          availabilityStatus: req.body.availabilityStatus,
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
        itemName: req.body.name,
        price: req.body.price,
        availabilityStatus: req.body.availabilityStatus,
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

  static async getAvailableMenu(req, res) {
    knex
      .select("*") // select all records
      .from("foodMenu")
      .where({ businessId: req.params.businessId, availabilityStatus: 1 })
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

  static async createFoodOrder(req, res) {
    const totalCost = await knex
      .select("*")
      .from("foodMenu")
      .whereIn("itemId", req.body.itemIds)
      .then((res) => {
        const prices = req.body.itemIds.map((i) =>
          res.find((r) => +r.itemId === +i)
            ? res.find((r) => +r.itemId === +i).price
            : 0
        );
        return prices.reduce((a, b) => a + b, 0);
      });

    knex("foodOrders")
      .insert({
        businessId: req.params.businessId,
        customerId: req.params.customerId,
        billingCost: totalCost,
        address: req.body.address,
        mobile: req.body.mobile,
        orderStatus: 1,
      })
      .then(async (result) => {
        req.body.itemIds
          .filter((data, index) => {
            return req.body.itemIds.indexOf(data) === index;
          })
          .map((itemId) => {
            console.log(
              {
                orderId: result[0],
                itemId: itemId,
                quantity: req.body.itemIds.filter((i) => +i === +itemId).length,
              },
              "this"
            );
            knex("itemOrders")
              .insert({
                orderId: result[0],
                itemId: itemId,
                quantity: req.body.itemIds.filter((i) => +i === +itemId).length,
              })
              .catch((e) => console.log(e, "error"));
          });

        const stripeCustomer = await stripe.customers
          .create({
            email: req.body.email,
          })
          .catch((e) => console.log(e, "customererror"));

        const paymentIntent = await stripe.paymentIntents
          .create({
            customer: stripeCustomer.customerId,
            amount: totalCost * 100,
            currency: "aud",
          })
          .catch((e) => console.log(e, "paymentintenterror"));
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      })
      .catch((err) => {
        console.log(err, "err");
        // Send a error message in response
        res.status(500).json({
          message: `There was an error adding food item: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async getTableBookingsForCustomer(req, res) {
    knex
      .select("*") // select all records
      .from("tableBookings")
      .join("businesses", "businesses.businessId", "tableBookings.businessId")
      .where(
        req.params.userType === "customer"
          ? { customerId: req.params.userId, bookingStatus: 1 }
          : { businessId: req.params.userId, bookingStatus: 1 }
      )
      .then((bookings) => {
        res.status(200).json(bookings);
      })
      .catch((err) => {
        console.log(err, "err");
        // Send a error message in response
        res.status(500).json({
          message: `There was an error retrieving table bookings: ${err}`,
        });
      });
  }

  static async getFoodOrdersForCustomer(req, res) {
    knex
      .select("*") // select all records
      .from("foodOrders")
      .join("itemOrders", "foodOrders.orderId", "itemOrders.orderId")
      .join("foodMenu", "itemOrders.itemId", "foodMenu.itemId")
      .join("businesses", "foodOrders.businessId", "businesses.businessId")
      .where(
        req.params.userType === "customer"
          ? { customerId: req.params.userId, orderStatus: 1 }
          : { businessId: req.params.userId, orderStatus: 1 }
      )
      .then((bookings) => {
        res.status(200).json(bookings);
      })
      .catch((err) => {
        console.log(err, "err");
        // Send a error message in response
        res.status(500).json({
          message: `There was an error retrieving table bookings: ${err}`,
        });
      });
  }
}

module.exports = Restaurants;
