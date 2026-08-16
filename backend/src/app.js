import express from "express";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

// Uploaded images ko access karne ke liye
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

export default app;
