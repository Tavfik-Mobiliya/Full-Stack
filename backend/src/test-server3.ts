import express from "express";
import projectRoutes from "./routes/products";
import testimonialRoutes from "./routes/testimonials";
import inquiryRoutes from "./routes/inquiries";

const app = express();
app.use("/api/products", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/inquiries", inquiryRoutes);

app.listen(5005, () => {
  console.log("Server with routes listening on 5005");
});
