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
exports.CouponController = void 0;
const coupon_service_1 = require("../services/coupon.service");
const email_service_1 = require("../services/email/email.service");
class CouponController {
    constructor() {
        this.couponService = new coupon_service_1.CouponService();
        this.emailService = new email_service_1.EmailService();
        // Bind the methods to ensure 'this' context is preserved
        this.getAllCoupons = this.getAllCoupons.bind(this);
        this.saveCoupon = this.saveCoupon.bind(this);
        this.deleteCoupon = this.deleteCoupon.bind(this);
        this.updateCouponStatus = this.updateCouponStatus.bind(this);
        this.verifyCoupon = this.verifyCoupon.bind(this);
    }
    getAllCoupons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupons = yield this.couponService.findAll();
                res.status(200).json({
                    success: true,
                    coupons,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error fetching coupons",
                    error: error.message,
                });
            }
        });
    }
    saveCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, discountPercentage, name, status } = req.body;
                const coupon = yield this.couponService.create({
                    code,
                    discountPercentage,
                    name,
                    status,
                });
                res.status(201).json({
                    success: true,
                    message: "Coupon saved successfully",
                    coupon,
                });
                // Send email to all users about new coupon
                const subject = "New Coupon Available!";
                const message = `A new coupon ${code} is now available with ${discountPercentage}% discount. Use it in your next purchase!`;
                yield this.emailService.sendEmailToAllUsers(subject, message);
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error saving coupon",
                    error: error.message,
                });
            }
        });
    }
    deleteCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.body;
                const deletedCoupon = yield this.couponService.deleteByCode(code);
                if (deletedCoupon) {
                    res.status(200).json({
                        success: true,
                        message: `Coupon with code ${code} deleted successfully`,
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: `Coupon with code ${code} not found`,
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error deleting coupon",
                    error: error.message,
                });
            }
        });
    }
    updateCouponStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, status } = req.body;
                const updatedCoupon = yield this.couponService.updateStatus(code, status);
                if (updatedCoupon) {
                    res.status(200).json({
                        success: true,
                        message: `Status of coupon with code ${code} updated successfully`,
                    });
                }
                else {
                    res.status(404).json({
                        success: false,
                        message: `Coupon with code ${code} not found`,
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error updating coupon status",
                    error: error.message,
                });
            }
        });
    }
    verifyCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.body;
                const coupon = yield this.couponService.findByCode(code);
                if (!coupon) {
                    res.status(404).json({
                        success: false,
                        message: "Coupon not found",
                    });
                    return;
                }
                if (coupon.status === "active") {
                    res.status(200).json({
                        success: true,
                        message: "Coupon is valid and active",
                        coupon,
                    });
                }
                else if (coupon.status === "expired") {
                    res.status(200).json({
                        success: false,
                        message: "Coupon has expired",
                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: `Coupon is not active (status: ${coupon.status})`,
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error verifying coupon",
                    error: error.message,
                });
            }
        });
    }
}
exports.CouponController = CouponController;
