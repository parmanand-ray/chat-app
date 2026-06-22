import genToken from "../config/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    //check user alredy exits
    let existingUser = await User.find({ $or: [{ username }, { email }] });

    if (existingUser.length > 0) {
      if (existingUser.some((user) => user.email == email)) {
        return res
          .status(409)
          .json({ status: false, message: "Email Already exists" });
      }

      if (existingUser.some((user) => user.username == username)) {
        return res
          .status(409)
          .json({ status: false, message: "Username Already exists" });
      }
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password should be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: false,
    });

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Signup Error ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { loginID, password } = req.body;

    if (!loginID || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    //check user alredy exits
    let existingUser = await User.findOne({
      $or: [{ username: loginID }, { email: loginID.toLowerCase() }],
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }

    let validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Credentials" });
    }

    const token = await genToken(existingUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: false,
    });

    return res.status(200).json({
      status: true,
      message: "Login successfully",
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Login Error ${error.message}` });
  }
};

export const logout = async (req, res) =>{
try{
  res.clearCookie("token");
  res.status(200).json({status:true, message:"Logout Successfull"});
}catch (error) {
    res
      .status(500)
      .json({ status: false, message: `Logout Error ${error.message}` });
  }
}