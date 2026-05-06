import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createResponse from "../utils/response.js";
import validatePassword from "../utils/validation.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import sendMail from "../utils/sendMail.js";
dotenv.config();
import moment from "moment";
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
const jwtSecret = process.env.JWT_SECRET;

import VerificationToken from "../models/Token.js";
import verificationEmail from "../utils/verificationEmail.js";
import forgotPasswordEmail from "../utils/forgotPaswordEmail.js";

export const registerHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(createResponse("Email and password are required", "error"));
  }

  if (!validatePassword(password)) {
    return res
      .status(400)
      .json(
        createResponse(
          "Password must be at least 8 characters long, contain a special character, a number, and a capital letter",
          "error"
        )
      );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(createResponse("Email already exists", "error"));
    }

    const existingVerificationToken = await VerificationToken.findOne({
      email,
    });
    if (existingVerificationToken) {
      const timeRemaining = moment(existingVerificationToken.createdAt)
        .add(15, "minutes")
        .diff(moment(), "minutes");

      if (timeRemaining > 0) {
        return res
          .status(400)
          .json(
            createResponse(
              `You need to wait ${timeRemaining} more minute(s) before trying again.`,
              "error"
            )
          );
      }

      await VerificationToken.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    const token = jwt.sign(
      {
        email,
        password: hashedPassword,
        verificationCode,
      },
      jwtSecret,
      { expiresIn: "15m" }
    );

    const verificationToken = new VerificationToken({
      token,
      verificationCode,
      email,
    });

    await verificationToken.save();

    const emailHtml = verificationEmail(verificationCode);
    await sendMail(email, "Verify Your Email", emailHtml);

    res.json(createResponse(verificationToken._id, "success"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        createResponse(
          "Error during registration. Please try again later.",
          "error"
        )
      );
  }
};

export const verifyHandler = async (req, res) => {
  const { id, code } = req.body;

  if (!id || !code) {
    return res
      .status(400)
      .json(createResponse("ID and verification code are required", "error"));
  }

  try {
    const verificationToken = await VerificationToken.findById(id);
    if (!verificationToken) {
      return res.status(404).json(createResponse("Record not found", "error"));
    }

    if (verificationToken.verificationCode !== code) {
      return res
        .status(400)
        .json(createResponse("Incorrect verification code", "error"));
    }

    const timeRemaining = moment(verificationToken.createdAt)
      .add(15, "minutes")
      .diff(moment(), "minutes");

    if (timeRemaining <= 0) {
      return res
        .status(400)
        .json(createResponse("Verification code has expired", "error"));
    }

    let decodedToken;
    try {
      decodedToken = jwt.decode(verificationToken.token);
      if (!decodedToken || !decodedToken.email || !decodedToken.password) {
        return res
          .status(400)
          .json(createResponse("Invalid verification token", "error"));
      }
    } catch (err) {
      return res
        .status(400)
        .json(createResponse("Failed to decode verification token", "error"));
    }

    const { email, password } = decodedToken;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(createResponse("User with this email already exists", "error"));
    }

    const newUser = new User({
      email,
      password,
    });

    await newUser.save();

    await VerificationToken.deleteOne({ _id: id });
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, {
      expiresIn: "30d",
    });

    newUser.password = undefined;
    res.json({ info: newUser, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        createResponse(
          "Error during verification. Please try again later.",
          "error"
        )
      );
  }
};

export const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(createResponse("Email and password are required", "error"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json(createResponse("Invalid email, user not found", "error"));
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "30d",
      });

      user.password = undefined;
      res.json({ info: user, token });
    } else {
      res
        .status(400)
        .json(createResponse("Incorrect password, please try again", "error"));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(createResponse("Error logging in user", "error"));
  }
};

// Change password handler
export const changePasswordHandler = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json(
        createResponse("Old password and new password are required", "error")
      );
  }

  if (!validatePassword(newPassword)) {
    return res
      .status(400)
      .json(
        createResponse(
          "New password must be at least 8 characters long, contain a special character, a number, and a capital letter",
          "error"
        )
      );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json(createResponse("User not found", "error"));
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (match) {
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      await user.save();

      res.json(createResponse("Password changed successfully"));
    } else {
      res
        .status(400)
        .json(createResponse("Old password is incorrect", "error"));
    }
  } catch (error) {
    res.status(500).json(createResponse("Error changing password", "error"));
  }
};

export const forgotPasswordRequestHandler = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(createResponse("Email is required", "error"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(createResponse("No user found with this email", "error"));
    }

    const existingVerificationToken = await VerificationToken.findOne({
      email,
    });
    if (existingVerificationToken) {
      const timeRemaining = moment(existingVerificationToken.createdAt)
        .add(15, "minutes")
        .diff(moment(), "minutes");
      if (timeRemaining > 0) {
        return res
          .status(400)
          .json(
            createResponse(
              `You need to wait ${timeRemaining} more minute(s) before trying again.`,
              "error"
            )
          );
      }
      await VerificationToken.deleteOne({ email });
    }

    const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;

    const token = jwt.sign({ email, verificationCode }, jwtSecret, {
      expiresIn: "15m",
    });

    const verificationToken = new VerificationToken({
      token,
      verificationCode,
      email,
    });
    await verificationToken.save();

    const emailHtml = forgotPasswordEmail(verificationCode);
    await sendMail(email, "Reset Your Password", emailHtml);

    res.json(createResponse(verificationToken._id, "success"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        createResponse(
          "Error processing request. Please try again later.",
          "error"
        )
      );
  }
};

export const forgotPasswordVerifyHandler = async (req, res) => {
  const { id, code, newPassword } = req.body;

  if (!id || !code || !newPassword) {
    return res
      .status(400)
      .json(
        createResponse(
          "ID, verification code, and new password are required",
          "error"
        )
      );
  }

  if (!validatePassword(newPassword)) {
    return res
      .status(400)
      .json(
        createResponse(
          "Password must be at least 8 characters long, contain a special character, a number, and a capital letter",
          "error"
        )
      );
  }

  try {
    const verificationToken = await VerificationToken.findById(id);
    if (!verificationToken) {
      return res.status(404).json(createResponse("Record not found", "error"));
    }

    if (verificationToken.verificationCode !== code) {
      return res
        .status(400)
        .json(createResponse("Incorrect verification code", "error"));
    }

    const timeRemaining = moment(verificationToken.createdAt)
      .add(15, "minutes")
      .diff(moment(), "minutes");

    if (timeRemaining <= 0) {
      return res
        .status(400)
        .json(createResponse("Verification code has expired", "error"));
    }

    let decodedToken;
    try {
      decodedToken = jwt.decode(verificationToken.token);
      if (!decodedToken || !decodedToken.email) {
        return res
          .status(400)
          .json(createResponse("Invalid verification token", "error"));
      }
    } catch (err) {
      return res
        .status(400)
        .json(createResponse("Failed to decode verification token", "error"));
    }

    const { email } = decodedToken;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(createResponse("No user found with this email", "error"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    await VerificationToken.deleteOne({ _id: id });

    res.json(createResponse("Password reset successful", "success"));
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        createResponse(
          "Error resetting password. Please try again later.",
          "error"
        )
      );
  }
};
