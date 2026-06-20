import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import e from "express";

const genToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });
    return token;
  } catch (error) {
    console.log("Token Err", error);
  }
};

export default genToken;
