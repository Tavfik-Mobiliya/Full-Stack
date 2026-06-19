import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import projectRoutes from "./routes/projects";
import testimonialRoutes from "./routes/testimonials";
import inquiryRoutes from "./routes/inquiries";
import authRoutes from "./routes/auth";
import collectionRoutes from "./routes/collections";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
