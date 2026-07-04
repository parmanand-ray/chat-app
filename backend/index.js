import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.Router.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.Routes.js";
import adminRouter from "./routes/admin.Routes.js";
import isAuth from "./middlewares/isAuth.js";
import uploadOnCloude from "./config/cloudinary.js";
import messageRouter from "./routes/message.Router.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend running" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", isAuth, userRouter);
app.use("/api/message", isAuth, messageRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 400;
  return res.status(status).json({
    status: false,
    message: err.message || "Something went wrong",
  });
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn(
      "Continuing without database connection. Fix MONGODB_URL or network access to mongodb.net.",
    );
  }
  // uploadOnCloude("https://www.aftfixing.com/uploaded-files/category/images/thumbs/anchor-rods-thumbs-400x400-v1770727137.webp");
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

startServer();
