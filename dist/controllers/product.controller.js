"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
class ProductController {
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productData = req.body;
                const product = new models_1.Product(Object.assign(Object.assign({}, productData), { productId: (0, uuid_1.v4)(), rating: 0, soldStockValue: 0 }));
                yield product.save();
                res.status(201).json({
                    status: true,
                    data: product,
                    message: "Product created succesfully",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error creating product", error });
            }
        });
    }
    getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, visibility, minPrice, maxPrice, sort } = req.query;
                const query = {};
                // Apply filters
                if (category)
                    query.category = category;
                if (visibility)
                    query.visibility = visibility;
                if (minPrice || maxPrice) {
                    query.price = {};
                    if (minPrice)
                        query.price.$gte = Number(minPrice);
                    if (maxPrice)
                        query.price.$lte = Number(maxPrice);
                }
                // Build sort options
                let sortOptions = {};
                if (sort) {
                    switch (sort) {
                        case "price_asc":
                            sortOptions.price = 1;
                            break;
                        case "price_desc":
                            sortOptions.price = -1;
                            break;
                        case "rating":
                            sortOptions.rating = -1;
                            break;
                        case "newest":
                            sortOptions._id = -1;
                            break;
                    }
                }
                const products = yield models_1.Product.find(query).sort(sortOptions);
                res
                    .status(200)
                    .json({ status: true, data: products, message: "All products" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error fetching products", error });
            }
        });
    }
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const product = yield models_1.Product.findOne({ productId });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error fetching product", error });
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const updateData = req.body;
                // Prevent updating certain fields
                delete updateData.productId;
                delete updateData.rating;
                delete updateData.soldStockValue;
                const product = yield models_1.Product.findOneAndUpdate({ productId }, updateData, { new: true });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error updating product", error });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const product = yield models_1.Product.findOneAndDelete({ productId });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                res
                    .status(200)
                    .json({ status: false, message: "Product deleted successfully" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error deleting product", error });
            }
        });
    }
    updateStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const { inStockValue } = req.body;
                const product = yield models_1.Product.findOneAndUpdate({ productId }, { inStockValue }, { new: true });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error updating stock", error });
            }
        });
    }
    updateVisibility(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const { visibility } = req.body;
                const product = yield models_1.Product.findOneAndUpdate({ productId }, { visibility }, { new: true });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                res.status(200).json(product);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error updating visibility", error });
            }
        });
    }
    searchProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.query;
                if (!query) {
                    res
                        .status(400)
                        .json({ status: false, message: "Search query is required" });
                    return;
                }
                const products = yield models_1.Product.find({
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { description: { $regex: query, $options: "i" } },
                        { category: { $regex: query, $options: "i" } },
                    ],
                    visibility: "on",
                });
                res.status(200).json(products);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error searching products", error });
            }
        });
    }
}
exports.ProductController = ProductController;
