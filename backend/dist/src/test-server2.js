"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const app = (0, express_1.default)();
app.get("/", async (req, res) => {
    try {
        const count = await prisma_1.default.project.count();
        res.json({ count });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        res.status(500).json({ error: message });
    }
});
app.listen(5005, () => {
    console.log("Server with prisma listening on 5005");
});
