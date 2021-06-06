const knex = require("./../database");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_SECRET_KEY);

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
        if (userData.length === 0) {
          return res.status(200).json({ signin: false });
        }
        const password = req.body && req.body.password ? req.body.password : "";
        // Send users extracted from database in response
        const verifyPassword = passwordHash.verify(
          password,
          userData[0].password
        );
        if (verifyPassword) {
          const token = jwt.sign({ data: userData }, process.env.JWT_SIGN_CODE);
          return res.json({ ...userData[0], token: token });
        } else {
          return res.status(200).json({ signin: false });
        }
      })
      .catch((err) => {
        // Send a error message in response
        return res
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
        address: req.body.address,
        openingHoursFrom: req.body.openingHoursFrom,
        openingHoursTo: req.body.openingHoursTo,
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

  static async updateUser(req, res) {
    delete req.body.customerId;
    delete req.body.businessId;
    knex(req.params.userType === "customer" ? "customers" : "businesses")
      .where(
        req.params.userType === "customer"
          ? { customerId: req.params.userId }
          : { businessId: req.params.userId }
      )
      .update(req.body)
      .then((re) => {
        // Send a success message in response
        res.status(200).json({});
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating business: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async getUserById(req, res) {
    await knex
      .select()
      .from(req.params.userType === "customer" ? "customers" : "businesses")
      .where(
        req.params.userType === "customer"
          ? { customerId: req.params.userId }
          : { businessId: req.params.userId }
      )
      .then((userData) => {
        const token = jwt.sign({ data: userData }, process.env.JWT_SIGN_CODE);
        res.json({ token: token });
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating business: ${req.body.name} with error: ${err}`,
        });
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

  static async forgotPasswordEmail(req, res) {
    await knex
      .select()
      .from(req.params.userType === "customer" ? "customers" : "businesses")
      .where({ email: req.body.email })
      .then((userData) => {
        if (Object.keys(userData[0]).length !== 0) {
          const token = jwt.sign(
            {
              email: userData[0].email,
              isCustomer: userData[0].customerId ? 1 : 0,
            },
            process.env.JWT_SIGN_CODE
          );
          const msg = {
            to: userData[0].email,
            from: "ishitavig@gmail.com",
            subject: "Forgot Password? FoodWeb",
            html: `You requested to reset your password. If it wasn't you, please contact support immediately. 
            <a href="http://www.localhost:3000/resetPassword/${token}">Click here to reset your password.</a>`,
          };

          sgMail.send(msg).then(
            () => {
              res.status(200).json({});
            },
            (error) => {
              console.error(error, "error sending email");

              if (error.response) {
                console.error(error.response.body);
              }
            }
          );
        }
      })
      .catch((err) => {
        // Send a error message in response
        res.status(500).json({
          message: `There was an error creating business: ${req.body} with error: ${err}`,
        });
      });
  }

  static async resetPassword(req, res) {
    const passwordsMatch = req.body.password === req.body.confirmPassword;

    passwordsMatch
      ? knex(req.params.userType === "customer" ? "customers" : "businesses")
          .where({ email: req.body.userEmail })
          .update({
            password: passwordHash.generate(req.body.password),
          })
          .then((re) => {
            // Send a success message in response
            res.status(200).json({});
          })
          .catch((err) => {
            // Send a error message in response
            res.status(500).json({
              message: `There was an error updating password: ${req.body} with error: ${err}`,
            });
          })
      : res.status(401).json({});
  }
}

module.exports = Users;
