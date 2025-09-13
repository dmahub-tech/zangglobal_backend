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
exports.CartController = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
class CartController {
    addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId, productQty } = req.body;
                const quantity = Number(productQty); // cast into number
                const product = yield models_1.Product.findOne({ productId });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                if (isNaN(quantity) || quantity <= 0) {
                    res.status(400).json({ status: false, message: "Invalid quantity" });
                    return;
                }
                if (product.inStockValue < quantity) {
                    res.status(400).json({ status: false, message: "Insufficient stock" });
                    return;
                }
                let cart = yield models_1.Cart.findOne({ userId });
                if (!cart) {
                    cart = new models_1.Cart({
                        cartId: (0, uuid_1.v4)(),
                        userId,
                        productsInCart: [],
                        total: 0,
                    });
                }
                const existingProductIndex = cart.productsInCart.findIndex((item) => item.productId.toString() === productId.toString());
                if (existingProductIndex > -1) {
                    cart.productsInCart[existingProductIndex].quantity += quantity;
                }
                else {
                    cart.productsInCart.push({
                        productId,
                        quantity,
                        price: product.price,
                        name: product.name,
                        img: product.img,
                        category: product.category,
                    });
                }
                cart.total = cart.productsInCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cart.updatedAt = new Date();
                yield cart.save();
                res.status(200).json({
                    success: true,
                    data: cart,
                    message: "Successfully added new item",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error adding item to cart", error });
            }
        });
    }
    getAllCartItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let cart = yield models_1.Cart.find();
                res.status(200).json({
                    success: true,
                    data: cart,
                    message: "All cart items",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ status: false, message: "Error adding item to cart", error });
            }
        });
    }
    updateCartItemQuantity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId, productQty } = req.body;
                const quantity = Number(productQty); // cast into number
                const product = yield models_1.Product.findOne({ productId });
                if (!product) {
                    res.status(404).json({ status: false, message: "Product not found" });
                    return;
                }
                if (product.inStockValue < quantity) {
                    res.status(400).json({ success: false, message: "Insufficient stock" });
                    return;
                }
                const cart = yield models_1.Cart.findOne({ userId });
                if (!cart) {
                    res.status(404).json({ status: false, message: "Cart not found" });
                    return;
                }
                const productIndex = cart.productsInCart.findIndex((item) => item.productId === productId);
                if (productIndex === -1) {
                    res
                        .status(404)
                        .json({ success: false, message: "Product not found in cart" });
                    return;
                }
                if (quantity <= 0) {
                    cart.productsInCart.splice(productIndex, 1);
                }
                else {
                    cart.productsInCart[productIndex].quantity = quantity;
                }
                cart.total = cart.productsInCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cart.updatedAt = new Date();
                yield cart.save();
                res.status(200).json({
                    status: true,
                    cart,
                    message: "Cart item quantity updated successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error updating cart item quantity",
                    error,
                });
            }
        });
    }
    removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId } = req.params;
                const cart = yield models_1.Cart.findOne({ userId });
                if (!cart) {
                    res.status(404).json({ success: false, message: "Cart not found" });
                    return;
                }
                const productIndex = cart.productsInCart.findIndex((item) => item.productId === productId);
                if (productIndex === -1) {
                    res
                        .status(404)
                        .json({ success: false, message: "Product not found in cart" });
                    return;
                }
                cart.productsInCart.splice(productIndex, 1);
                cart.total = cart.productsInCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                cart.updatedAt = new Date();
                yield cart.save();
                res
                    .status(200)
                    .json({
                    status: true,
                    cart,
                    message: "Item removed from cart successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error removing item from cart",
                    error,
                });
            }
        });
    }
    getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const cart = yield models_1.Cart.findOne({ userId });
                if (!cart) {
                    res.status(404).json({ success: false, message: "Cart not found" });
                    return;
                }
                res.status(200).json({
                    status: true,
                    cart,
                    message: "User cart items fetched successfully",
                });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Error fetching cart", error });
            }
        });
    }
    clearCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const cart = yield models_1.Cart.findOne({ userId });
                if (!cart) {
                    res.status(404).json({ success: false, message: "Cart not found" });
                    return;
                }
                cart.productsInCart = [];
                cart.total = 0;
                cart.updatedAt = new Date();
                yield cart.save();
                res
                    .status(200)
                    .json({ success: false, message: "Cart cleared successfully" });
            }
            catch (error) {
                res
                    .status(500)
                    .json({ success: false, message: "Error clearing cart", error });
            }
        });
    }
}
exports.CartController = CartController;
