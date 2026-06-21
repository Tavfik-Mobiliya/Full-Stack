const express = require('express');
const app = express();
const apiRouter = express.Router();
apiRouter.use("/products", (req, res) => res.send("products"));
app.use("/api", apiRouter);
app.get("*", (req, res) => res.status(404).send("not found: " + req.url));

const request = require('supertest');
request(app).get('/api').expect(404).end((err, res) => {
  console.log("GET /api ->", res.status, res.text);
});
request(app).get('/api/products').expect(200).end((err, res) => {
  console.log("GET /api/products ->", res.status, res.text);
});
