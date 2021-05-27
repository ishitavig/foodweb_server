const knex = require("./../database");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

class Users {
  static async customerSignUp(req, res) {
    knex("customers")
      .insert({
        // insert new record, a user
        name: req.body.name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        mobile: req.body.mobile,
      })
      .then((re) => {
        // Send a success message in response
        res.status(200).json({ name: req.body.name, email: req.body.email });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating customers: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async customerSignIn(req, res) {
    knex
      .select("*") // select all records
      .from("customers") // from 'users' table
      .where({ email: req.body.email })
      .then((userData) => {
        const password = req.body && req.body.password ? req.body.password : "";
        // Send users extracted from database in response
        const verifyPassword = passwordHash.verify(
          password,
          userData[0].password
        );
        if (verifyPassword) {
          const token = jwt.sign({ data: userData }, process.env.JWT_SIGN_CODE);
          res.json({ ...userData[0], token: token });
        } else {
          res.status(200).json({ signin: false });
        }
      })
      .catch((err) => {
        // Send a error message in response
        res
          .status(500)
          .json({ message: `There was an error retrieving customer: ${err}` });
      });
  }

  static async businessSignUp(req, res) {
    knex("businesses")
      .insert({
        // insert new record, a user
        name: req.body.name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        mobile: req.body.mobile,
        abn: req.body.abn,
        tableBookingStatus: req.body.tableBookingStatus,
        foodOrderStatus: req.body.foodOrderStatus,
      })
      .then((re) => {
        // Send a success message in response
        res.status(200).json({ name: req.body.name, email: req.body.email });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating business: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async businessSignIn(req, res) {
    knex
      .select("*") // select all records
      .from("businesses") // from 'users' table
      .where({ email: req.body.email })
      .then((userData) => {
        const password = req.body && req.body.password ? req.body.password : "";
        // Send users extracted from database in response
        const verifyPassword = passwordHash.verify(
          password,
          userData[0].password
        );
        if (verifyPassword) {
          const token = jwt.sign({ data: userData }, process.env.JWT_SIGN_CODE);
          res.json({ ...userData[0], token: token });
        } else {
          res.status(200).json({ signin: false });
        }
      })
      .catch((err) => {
        // Send a error message in response
        res
          .status(500)
          .json({ message: `There was an error retrieving business: ${err}` });
      });
  }

  static async searchRestaurants(req, res) {
    try {
      const result = await axios.post(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${req.query.city}&type=restaurant&key=${process.env.GOOGLE_PLACES_API}&radius=1000`
      );
      if (result && result.data && result.data.results) {
        res.status(200).json(result.data.results);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = Users;
