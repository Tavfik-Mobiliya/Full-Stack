"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res) => res.send("ok"));
const server = app.listen(5005, () => {
    console.log("Server listening on 5005");
});
// Let's keep it open or log if it closes
server.on("close", () => console.log("Server closed"));
