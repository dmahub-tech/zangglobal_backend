"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: [{ type: String }],
    category: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    productId: { type: String, required: true, unique: true },
    inStockValue: { type: Number, required: true, default: 0 },
    soldStockValue: { type: Number, default: 0 },
    visibility: { type: String, default: "on" },
});
const ProductModel = (0, mongoose_1.model)("Product", ProductSchema);
exports.default = ProductModel;
