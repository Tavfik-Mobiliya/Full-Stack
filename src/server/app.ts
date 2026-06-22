import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { randomUUID } from "crypto";
import productRoutes from "./routes/products";
import testimonialRoutes from "./routes/testimonials";
import inquiryRoutes from "./routes/inquiries";
import authRoutes from "./routes/auth";
import collectionRoutes from "./routes/collections";
import dealRoutes from "./routes/deals";
import settingsRoutes from "./routes/settings";
import { env } from "./config/env";

const app = express();
const apiRouter = express.Router();

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use((req, res, next) => {
  const requestId = randomUUID();
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);
  next();
});
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

apiRouter.use("/products", productRoutes);
apiRouter.use("/testimonials", testimonialRoutes);
apiRouter.use("/inquiries", inquiryRoutes);
apiRouter.use("/auth", authRoutes);
apiRouter.use("/collections", collectionRoutes);
apiRouter.use("/deals", dealRoutes);
apiRouter.use("/settings", settingsRoutes);

app.use("/api", apiRouter);
app.use("/api/v1", apiRouter);

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  void next;
  const statusCode = err instanceof Error && "statusCode" in err ? Number((err as { statusCode?: number }).statusCode) : 500;
  const safeMessage = err instanceof Error ? err.message : "Something went wrong on the server.";
  const responseMessage = statusCode >= 500 ? "Internal server error" : safeMessage;

  if (statusCode >= 500) {
    console.error(`[${req.method}] ${req.originalUrl} request_id=${res.getHeader("x-request-id") ?? "unknown"}`, err);
  }

  res.status(Number.isFinite(statusCode) ? statusCode : 500).json({ error: responseMessage });
});

export default app;
