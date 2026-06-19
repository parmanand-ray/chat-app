import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend running" });
});

const startServer = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.warn(
      "Continuing without database connection. Fix MONGODB_URL or network access to mongodb.net.",
    );
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${PORT}`);
  });
};

startServer();
