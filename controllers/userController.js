const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Role = require("../models/Roles");

const app = express();
app.use(cookieParser());

const generateToken = (id) => {
  return jwt.sign({ id }, "everything", { expiresIn: "1h" });
};

//  Register User

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, confirmPassword, roles, active } = req.body;
    const ProfilePhoto = req.file.path;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.send({ success: false, msg: "Passwords do not match" });
    }


    const user = await User.create({
      name: name,
      email: email,
      password: password,
      roles: roles,
      photo: ProfilePhoto,
      active: active,
    });
    return res.send({ success: true, msg: "User added successfully", user });
  } catch (error) {
    return res.send({ error: error.message });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({ success: false, msg: "Please fill all required fields" });
  }

  const user = await User.findOne({ email });
  console.log("email", email)
  if (!user) {
    return res.send({ success: false, msg: "User not found" });
  }

  const passwordIscorrect = await bcrypt.compare(password, user.password);
  const id = user._id;
  console.log("ID",id);
  const token = generateToken(id);
  console.log(token);
  const roles = await Role.findOne({ role: user.roles[0] });
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  if (user && passwordIscorrect) {
    return res.send({
      success: true,
      msg: "Successfully LoggedIn",
      _id: user._id,
      token,
      roles: roles,
    });
  } else {
    return res.status(401).send({ success: false, msg: "Invalid Credentials" });
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({
    message: "Successfully logged out",
  });
});

// Get User Data
const getLoggedInUser = asyncHandler(async (req, res) => {

  let userId = req.body.id;
  console.log("userid",req.body);
  const user = await User.findById(userId);

  if (user) {
    const {
      _id,
      name,
      email,
      photo,
      password,
      roles,
      active
    } = user;
    return res.send({
      success: true,
      _id,
      name,
      email,
      photo,
      password,
      roles,
      active,
    });
  } else {
    return res.send({ success: false, msg: "User not found" });
  }
});

// Get Specific User
const getSpecificUser = asyncHandler(async (req, res) => {
  try {
    let userId = req.body.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (user) {
      const { _id, name, email, photo, roles, active } = user;
      return res.send({
        success: true,
        _id,
        name,
        email,
        photo,
        roles,
        active,
      });
    } else {
      return res.send({ success: false, msg: "User not found" });
    }
  } catch (error) {
    // Handle any errors that might occur during the execution of the function
    return res.send({ success: false, error: error });
  }
});

//   Get login Status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.send({ success: false });
  }

  // Verify token
  try {
    // Verify token
    const verified = jwt.verify(token, "everything");
    if (verified) {
      return res.send({ success: true });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Token has expired
      return res.send({ success: false, message: "Token expired" });
    } else {
      // Other verification errors
      return res.send({ success: false, message: "Invalid token" });
    }
  }
});

//  Update User
// const updateUser = asyncHandler(async (req, res) => {
//   if (req.body.id) {
//     const { id, name, roles, active } = req.body;
//     const user = await User.findById(id);
//     const photo = req.file ? req.file.path : user.photo; // Get the path of the uploaded file

//     await User.findByIdAndUpdate(id, {
//       name: name,
//       roles: roles,
//       photo: photo,
//       active: active,
//     });



//     return res.send({
//       success: true,
//       msg: "User updated",
//     });
//   } else {
//     return res.send({
//       success: false,
//       msg: "User not found",
//     });
//   }
// });
const updateUser = asyncHandler(async (req, res) => {
  try {
    console.log("body", req.body, req.params.id);
    const { name } = req.body;
    const userId = req.params.id;

    // Find the user in the User schema
    const user = await User.findById(userId);
    if (!user) {
      return res.send({
        success: false,
        msg: "User not found",
      });
    }

    // Update the relevant fields in the User schema
    user.name = name;
    user.photo = req.file ? req.file.path : user.photo;
    user.active = req.body.active;

    await user.save();

    return res.send({
      success: true,
      msg: "User updated",
    });
  } catch (error) {
    console.error("Error during update:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
});


// Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);
  const { oldPassword, newPassword, id } = req.body;
  if (!user) {
    return res.send({ success: false, msg: "User not found , Please signup" });
  }
  // Validate
  if (!oldPassword || !newPassword) {
    return res.send({ success: false, msg: "Please add old and new password" });
  }

  // check if old password matches password in DB
  const passwordMatches = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatches) {
    return res.send({ success: false, msg: "Old password is incorrect" });
  }

  if (oldPassword === newPassword) {
    return res.send({
      success: false,
      msg: "New Password cannot be same as Old password",
    });
  } else {
    const secPass = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, {
      password: secPass,
    });
    return res.send({ success: true, msg: "Password changed successfully" });
  }
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  let { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ success: false, msg: "User  not found" });
  }
  // Delete Token if it exist in DB
  await Token.findOneAndDelete({ userId: user.id });

  // Create Rest Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // /Save token to DB
  await new Token({
    userId: user.id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 Minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

  // Reset Email
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use this URL below to reset your password</p>
  <p>This reset link is valid for 30 Minutes</p>


  <a href=${resetUrl} clicktraking = off> ${resetUrl}</a>

  <p>Regards .... </p>
  `;
  const subject = "Password reset request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    return res.send({ success: true, msg: "Reset Email Sent" });
  } catch (error) {
    return res.send(error);
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token  then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find Token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    return res.send("Invalid or Expired Token");
  }

  // Find User
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;

  user.save();

  return res.send({
    success: true,
    msg: "Password Reset Successful,Please Login",
  });
});

// Get User
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().exec();
  if (users) {
    return res.send({ users });
  } else {
    return res.send({ success: false, msg: "User not found" });
  }
});

// Delete User

const DeleteUser = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const users = await User.findByIdAndRemove(id);
  if (users) {
    return res.send({ success: true, msg: "User Deleted Successfully" });
  } else {
    return res.send({ success: false, msg: "User not found" });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getLoggedInUser,
  loginStatus,
  updateUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  DeleteUser,
  getSpecificUser,
};
