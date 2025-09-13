"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("../controllers/coupon.controller");
const router = express_1.default.Router();
const couponController = new coupon_controller_1.CouponController();
router.get("/get-coupons", couponController.getAllCoupons);
// Save coupon route
router.post("/save-coupons", couponController.saveCoupon);
// Delete coupon route
router.delete("/delete-coupons", couponController.deleteCoupon);
// Update status route
router.put("/update-status", couponController.updateCouponStatus);
// Verify coupon route
router.post("/verify-coupons", couponController.verifyCoupon);
exports.default = router;
