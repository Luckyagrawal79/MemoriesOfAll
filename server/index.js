import { CommentRoutes, PostRoutes, UserRoutes } from "./routes/index.js";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

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
