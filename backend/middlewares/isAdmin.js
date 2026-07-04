import User from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        status: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Admin Auth Error: ${error.message}`,
    });
  }
};

export default isAdmin;
