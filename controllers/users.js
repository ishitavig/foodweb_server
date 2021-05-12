const knex = require("./../database");
const passwordHash = require("password-hash");

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
}

module.exports = Users;
