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
exports.ReviewController = void 0;
const models_1 = require("../models");
class ReviewController {
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, productId, review, rating } = req.body;
                const userOrders = yield models_1.Order.find({
                    userId,
                    productIds: productId,
                    status: "Delivered",
                });
                const verified = userOrders.length > 0;
                const newReview = new models_1.Review({
                    userId,
                    productId,
                    review,
                    rating,
                    verified,
                });
                yield newReview.save();
                const allProductReviews = yield models_1.Review.find({ productId });
                const averageRating = allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
                    allProductReviews.length;
                yield models_1.Product.findOneAndUpdate({ productId }, { rating: Math.round(averageRating * 10) / 10 });
                res.status(201).json(newReview);
            }
            catch (error) {
                res.status(500).json({ message: "Error creating review", error });
            }
        });
    }
    getProductReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const reviews = yield models_1.Review.find({ productId }).sort({ createdAt: -1 });
                res.status(200).json(reviews);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching product reviews", error });
            }
        });
    }
    getUserReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const reviews = yield models_1.Review.find({ userId }).sort({ createdAt: -1 });
                res.status(200).json(reviews);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching user reviews", error });
            }
        });
    }
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                const { review, rating } = req.body;
                const updatedReview = yield models_1.Review.findByIdAndUpdate(reviewId, { review, rating }, { new: true });
                if (!updatedReview) {
                    res.status(404).json({ message: "Review not found" });
                    return;
                }
                const productId = updatedReview.productId;
                const allProductReviews = yield models_1.Review.find({ productId });
                const averageRating = allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
                    allProductReviews.length;
                yield models_1.Product.findOneAndUpdate({ productId }, { rating: Math.round(averageRating * 10) / 10 });
                res.status(200).json(updatedReview);
            }
            catch (error) {
                res.status(500).json({ message: "Error updating review", error });
            }
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId } = req.params;
                const review = yield models_1.Review.findByIdAndDelete(reviewId);
                if (!review) {
                    res.status(404).json({ message: "Review not found" });
                    return;
                }
                const productId = review.productId;
                const allProductReviews = yield models_1.Review.find({ productId });
                const averageRating = allProductReviews.length > 0
                    ? allProductReviews.reduce((acc, curr) => acc + curr.rating, 0) /
                        allProductReviews.length
                    : 0;
                yield models_1.Product.findOneAndUpdate({ productId }, { rating: Math.round(averageRating * 10) / 10 });
                res.status(200).json({ message: "Review deleted successfully" });
                return;
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error deleting review", error, status: false });
            }
        });
    }
    getAllReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviews = yield models_1.Review.find().sort({ createdAt: -1 });
                res
                    .status(200)
                    .json({
                    reviews,
                    message: "Reviews fetched successfully",
                    status: true,
                });
                return;
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching reviews", error, status: false });
            }
        });
    }
}
exports.ReviewController = ReviewController;
