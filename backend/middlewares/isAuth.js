import jwt from "jsonwebtoken";

 const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Token Not Found" });
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `Token Error ${error.message}`,
    });
  }
};
export default isAuth;