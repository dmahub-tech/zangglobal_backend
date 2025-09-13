"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cronRouter = (0, express_1.Router)();
cronRouter.get("/", (req, res) => {
    console.log("wake up server");
    res.send("Server is awake and job ran successfully.");
});
exports.default = cronRouter;
