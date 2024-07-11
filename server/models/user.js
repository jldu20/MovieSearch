const { Schema, model } = require("mongoose");

// defining the user schema
const userSchema = new Schema({
  email: {
    type: String,
    // specifies that the field is required
    required: true,
    // specifies that the field is unique
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    // specifies the default value of the field
    default: false,
  },
  refreshtoken: {
    type: String,
  },
  favorite_TVs: {
    type: [String], // Array of strings
    default: []     // Default empty array
  },
  favorite_movies: {
    type: [String],
    default: []
  }
});

// exporting the user model
module.exports = model("User", userSchema);