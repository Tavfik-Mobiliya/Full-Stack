"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projects_1 = __importDefault(require("./routes/projects"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
const app = (0, express_1.default)();
app.use("/api/projects", projects_1.default);
app.use("/api/testimonials", testimonials_1.default);
app.use("/api/inquiries", inquiries_1.default);
app.listen(5005, () => {
    console.log("Server with routes listening on 5005");
});
