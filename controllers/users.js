const knex = require("./../database");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");

class Users {
  static async signup(req, res) {
    knex("users")
      .insert({
        // insert new record, a user
        name: req.body.name,
        email: req.body.email,
        password: passwordHash.generate(req.body.password),
        mobile: req.body.mobile,
      })
      .then(() => {
        // Send a success message in response
        res.json({ name: req.body.name, email: req.body.email });
      })
      .catch((err) => {
        // Send a error message in response
        res.json({
          message: `There was an error creating user: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async signin(req, res) {
    knex
      .select("*") // select all records
      .from("users") // from 'users' table
      .where({ email: req.body.email })
      .then((userData) => {
        // Send users extracted from database in response
        const verifyPassword = passwordHash.verify(
          req.body.password,
          userData[0].password
        );
        if (verifyPassword) {
          const token = jwt.sign({ data: userData }, "secretcode");
          res.json({ ...userData[0], token: token });
        } else {
          res.json({ signin: false });
        }
      })
      .catch((err) => {
        // Send a error message in response
        res.json({ message: `There was an error retrieving users: ${err}` });
      });
  }
}

module.exports = Users;
