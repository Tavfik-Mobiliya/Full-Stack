import express from "express";
import prisma from "./prisma";

const app = express();

app.get("/", async (req, res) => {
  try {
    const count = await prisma.project.count();
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5005, () => {
  console.log("Server with prisma listening on 5005");
});
