import express from "express";
const app = express();
app.get("/", (req, res) => res.send("ok"));
const server = app.listen(5005, () => {
  console.log("Server listening on 5005");
});
// Let's keep it open or log if it closes
server.on("close", () => console.log("Server closed"));
