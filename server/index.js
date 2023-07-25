import { CommentRoutes, PostRoutes, UserRoutes } from "./routes/index.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// Function to extract the client IP address from the request headers
function getClientIp(req) {
  // First, check the 'X-Forwarded-For' header
  const xForwardedFor = req.header("X-Forwarded-For");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  // If 'X-Forwarded-For' is not available, use 'req.connection.remoteAddress'
  return req.connection.remoteAddress;
}

// Use custom keyGenerator function to extract client IP for rate limiting
app.use(
  rateLimit({
    windowMs: 12 * 60 * 1000, // 1 minute
    max: 30,
    keyGenerator: (req) => getClientIp(req), // Use the custom function to get the client IP
  })
);

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/posts", PostRoutes);
app.use("/user", UserRoutes);
app.use("/comments", CommentRoutes);

app.get("/", (_, res) => res.send("Hello"));

const PORT = process.env.PORT || 5000;
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://now:nowhere@atlascluster.vq4heuo.mongodb.net/Memories?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB Database"))
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(`Server did not connect ⚠️\n${error}`));
