const knex = require("./../database");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const priceIds = {
  1: "price_1IyCKyDgQbLDaO1zzKMwCMM1",
  2: "price_1IyCLfDgQbLDaO1zHGOsrTFR",
  3: "price_1IyCMNDgQbLDaO1z2Av2DYK7",
};

class Advertisements {
  static async create(req, res) {
    knex("businessAds")
      .insert({
        businessId: req.params.businessId,
        heading: req.body.heading,
        text: req.body.content,
        startDate: req.body.startDate || Date.now(),
        endDate: req.body.endDate || Date.now(),
        visibilityStatus: req.body.visibilityStatus,
        planId: req.body.planId,
      })
      .then((re) => {
        // Send a success message in response
        res
          .status(200)
          .json({ heading: req.body.heading, content: req.body.content });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating ad: ${req.body.heading} with error: ${err}`,
        });
      });
  }

  static async update(req, res) {
    knex("businessAds")
      .where({ businessId: req.params.businessId, adId: req.params.adId })
      .update(req.body)
      .then((re) => {
        // Send a success message in response
        res.status(200).json({});
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error updating ad: ${req.body.heading} with error: ${err}`,
        });
      });
  }

  static async delete(req, res) {
    knex("businessAds")
      .where({ adId: +req.params.adId, businessId: +req.params.businessId })
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

  static async getAdsByBusinessId(req, res) {
    knex
      .select("*") // select all records
      .from("businessAds") // from 'businessAds' table
      .where({ businessId: req.params.businessId })
      .then((adData) => {
        res.json(adData);
      })
      .catch((err) => {
        // Send a error message in response
        res
          .status(500)
          .json({ message: `There was an error retrieving ads: ${err}` });
      });
  }

  static async purchasePlan(req, res) {
    try {
      const stripeCustomer = await stripe.customers.create({
        email: req.body.email,
      });

      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [
          {
            price: priceIds[req.params.planId],
          },
        ],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      knex("businesses")
        .where({ email: req.body.email })
        .update({ planId: +req.params.planId, billingId: subscription.id })
        .then(() => {
          res.status(200).json({
            subscriptionId: subscription.id,
            clientSecret:
              subscription.latest_invoice.payment_intent.client_secret,
          });
        });
    } catch (err) {
      res.status(400);
      return res.send({
        error: {
          message: err.message,
        },
      });
    }
  }

  static async getAdPlans(req, res) {
    knex
      .select("*") // select all records
      .from("adPlans") // from 'blogs' table
      .then((planData) => {
        res.json(planData);
      })
      .catch((err) => {
        // Send a error message in response
        res
          .status(500)
          .json({ message: `There was an error retrieving ad plans: ${err}` });
      });
  }

  static async getAllAds(req, res) {
    knex
      .select("*") // select all records
      .from("businessAds") // from 'businessAds' table
      .then((adData) => {
        res.json(adData);
      })
      .catch((err) => {
        // Send a error message in response
        res
          .status(500)
          .json({ message: `There was an error retrieving ads: ${err}` });
      });
  }
}

module.exports = Advertisements;
