const knex = require("./../database");

class Blogs {
  static async create(req, res) {
    knex("blogs")
      .insert({
        // insert new record, a user
        customerId: req.body.customerId || 0,
        businessId: req.body.businessId || 0,
        heading: req.body.heading,
        content: req.body.content,
        postedOn: Date.now(),
        visibilityStatus: 1,
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
          message: `There was an error creating customers: ${req.body.name} with error: ${err}`,
        });
      });
  }

  static async getAll(req, res) {
    knex
      .select("*") // select all records
      .from("blogs") // from 'blogs' table
      .then((blogData) => {
        res.json(blogData);
      })
      .catch((err) => {
        // Send a error message in response
        res
          .status(500)
          .json({ message: `There was an error retrieving blogs: ${err}` });
      });
  }
}

module.exports = Blogs;
