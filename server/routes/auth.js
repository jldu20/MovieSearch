const express = require("express");
const router = express.Router();
const { hash, compare } = require("bcryptjs");
// importing the user model
const User = require("../models/user");
// Sign Up request
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. check if user already exists
    const user = await User.findOne({ email: email });

    // if user exists already, return error
    if (user)
      return res.status(500).json({
        message: "User already exists! Try logging in. 😄",
        type: "warning",
      });
    // 2. if user doesn't exist, create a new user
    // hashing the password
    const passwordHash = await hash(password, 10);
    const newUser = new User({
      email: email,
      password: passwordHash,
    });
    // 3. save the user to the database
    await newUser.save();
    // 4. send the response
    res.status(200).json({
      message: "User created successfully! 🥳",
      type: "success",
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error creating user!",
      error,
    });
  }
});

// const { hash, compare } = require("bcryptjs");
// importing the helper functions
const {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../utils/tokens");

// Sign In request
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. check if user exists
    const user = await User.findOne({ email: email });

    // if user doesn't exist, return error
    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    // 2. if user exists, check if password is correct
    const isMatch = await compare(password, user.password);

    // if password is incorrect, return error
    if (!isMatch)
      return res.status(500).json({
        message: "Password is incorrect! ⚠️",
        type: "error",
      });

    // 3. if password is correct, create the tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // 4. put refresh token in database
    user.refreshtoken = refreshToken;
    await user.save();

    // 5. send the response
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      type: "error",
      message: "Error signing in!",
      error,
    });
  }
});

// Sign Out request
router.post("/logout", (_req, res) => {
  // clear cookies
  res.clearCookie("refreshtoken");
  return res.json({
    message: "Logged out successfully! 🤗",
    type: "success",
  });
});

const { verify } = require("jsonwebtoken");
// Refresh Token request
router.post("/refresh_token", async (req, res) => {
  try {
    const { refreshtoken } = req.cookies;
    // if we don't have a refresh token, return error
    if (!refreshtoken)
      return res.status(500).json({
        message: "No refresh token! 🤔",
        type: "error",
      });
    // if we have a refresh token, you have to verify it
    let id;
    try {
      id = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET).id;
    } catch (error) {
      return res.status(500).json({
        message: "Invalid refresh token! 🤔",
        type: "error",
      });
    }
    // if the refresh token is invalid, return error
    if (!id)
      return res.status(500).json({
        message: "Invalid refresh token! 🤔",
        type: "error",
      });
    // if the refresh token is valid, check if the user exists
    const user = await User.findById(id);
    // if the user doesn't exist, return error
    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    // if the user exists, check if the refresh token is correct. return error if it is incorrect.
    if (user.refreshtoken !== refreshtoken)
      return res.status(500).json({
        message: "Invalid refresh token! 🤔",
        type: "error",
      });
    // if the refresh token is correct, create the new tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);
    // update the refresh token in the database
    user.refreshtoken = refreshToken;
    // send the new tokes as response
    sendRefreshToken(res, refreshToken);
    return res.json({
      message: "Refreshed successfully! 🤗",
      type: "success",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error refreshing token!",
      error,
    });
  }
});

//Add favorite movies/TV shows to user's database
router.post("/addFavorite", async (req, res) => {
  try {
    const { email, contentId, contentType } = req.body;
    //Find the user by email
    const user = await User.findOne({ email: email });

    // If user doesn't exist, return an error
    if (!user)
      return res.status(404).json({
        message: "User not found! 😞",
        type: "error",
      });

    //Depending on contentType, add the ID to the appropriate field
    if (contentType === 'TV') {
      // Check if the TV show ID is already in the list
      if (!user.favorite_TVs.includes(contentId)) {
        user.favorite_TVs.push(contentId);
      } else {
        return res.status(400).json({
          message: "TV show already added to favorites! 📺",
          type: "warning",
        });
      }
    } else if (contentType === 'movie') {
      // Check if the movie ID is already in the list
      if (!user.favorite_movies.includes(contentId)) {
        user.favorite_movies.push(contentId);
      } else {
        return res.status(400).json({
          message: "Movie already added to favorites! 🎥",
          type: "warning",
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid content type specified!",
        type: "error",
      });
    }

    //Save the updated user
    await user.save();

    //Send the response
    res.status(200).json({
      message: "Content added to favorites successfully! 🌟",
      type: "success",
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error updating favorites!",
      error: error.message,
    });
  }
});

//Return the list of movies and TV shows id
router.get("/favorites", async (req, res) => {
  try {
    const { email } = req.query; // Assuming the email is passed as a query parameter

    //Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        type: "error"
      });
    }

    //Extract the favorites from the user object
    const favorites = {
      favorite_TVs: user.favorite_TVs,
      favorite_movies: user.favorite_movies
    };

    //Return the favorites
    res.status(200).json({
      message: "Favorites retrieved successfully!",
      type: "success",
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error retrieving favorites",
      error: error.message
    });
  }
});


const { protect } = require("../utils/protected");
// protected route
router.get("/protected", protect, async (req, res) => {
  // console.log(req);
  try {
    // if user exists in the request, send the data
    if (req.user)
      return res.json({
        message: "You are logged in! 🤗",
        type: "success",
        user: req.user,
      });
    // if user doesn't exist, return error
    return res.status(500).json({
      message: "You are not logged in! 😢",
      type: "error",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      type: "error",
      message: "Error getting protected route!",
      error,
    });
  }
});

const { createPasswordResetToken } = require("../utils/tokens");
const {
  transporter,
  createPasswordResetUrl,
  passwordResetTemplate,
  passwordResetConfirmationTemplate,
} = require("../utils/email");
// send password reset email
router.post("/send-password-reset-email", async (req, res) => {
  try {
    // get the user from the request body
    const { email } = req.body;
    // find the user by email
    const user = await User.findOne({ email });
    // if the user doesn't exist, return error
    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    // create a password reset token
    const token = createPasswordResetToken({ ...user, createdAt: Date.now() });
    // create the password reset url
    const url = createPasswordResetUrl(user._id, token);
    // send the email
    const mailOptions = passwordResetTemplate(user, url);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res.status(500).json({
          message: "Error sending email! 😢",
          type: "error",
        });
      return res.json({
        message: "Password reset link has been sent to your email! 📧",
        type: "success",
      });
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error sending email!",
      error,
    });
  }
});

// reset password
router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    // get the user details from the url
    const { id, token } = req.params;
    // get the new password the request body
    const { newPassword } = req.body;
    // find the user by id
    const user = await User.findById(id);
    // if the user doesn't exist, return error
    if (!user)
      return res.status(500).json({
        message: "User doesn't exist! 😢",
        type: "error",
      });
    // verify if the token is valid
    const isValid = verify(token, user.password);
    // if the password reset token is invalid, return error
    if (!isValid)
      return res.status(500).json({
        message: "Invalid token! 😢",
        type: "error",
      });
    // set the user's password to the new password
    user.password = await hash(newPassword, 10);
    // save the user
    await user.save();
    // send the email
    const mailOptions = passwordResetConfirmationTemplate(user);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err)
        return res.status(500).json({
          message: "Error sending email! 😢",
          type: "error",
        });
      return res.json({
        message: "Email sent! 📧",
        type: "success",
      });
    });
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: "Error sending email!",
      error,
    });
  }
});

router.get('/', (req, res) => {
  // Logic for handling requests to /auth/
  res.send('Welcome to the authentication page!');
});

// router.get('/signin', (req, res) => {
//   // Logic for handling requests to /auth/login
//   res.send('This is the login page');
// });

// // Route handler for the signup page (/auth/signup)
// router.get('/signup', (req, res) => {
//   // Logic for handling requests to /auth/signup
//   res.send('This is the signup page');
// });

// router.get('/signin', (req, res) => {
//   // Logic for handling requests to /auth/login
//   res.send('This is the signin page');
// });

// // Route handler for the signup page (/auth/signup)
// router.get('/logout', (req, res) => {
//   // Logic for handling requests to /auth/signup
//   res.send('This is the logout page');
// });

module.exports = router;