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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../../models/user.model"));
dotenv_1.default.config();
class EmailService {
    constructor() {
        this.fromEmail = '"Mera Bestie" <pecommerce8@gmail.com>';
        this.supportEmail = "support@merabestie.com";
        this.supportPhone = "+1-800-BESTIE";
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_SERVER,
            port: parseInt(process.env.EMAIL_PORT || "465"),
            secure: process.env.EMAIL_SECURE === "true" || false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    // Base template for consistent styling
    getBaseTemplate(content) {
        return `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #ffb6c1; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="font-family: 'Brush Script MT', cursive; color: #ffffff; font-size: 36px; margin: 0;">Mera Bestie</h1>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 20px;">
          ${content}
        </div>
        
        <!-- Contact Section -->
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0; font-size: 16px;">Need Help?</h3>
          <p style="margin: 5px 0; font-size: 14px; color: #555;">
            📧 Email: <a href="mailto:${this.supportEmail}" style="color: #ffb6c1;">${this.supportEmail}</a><br>
            📞 Phone: <a href="tel:${this.supportPhone}" style="color: #ffb6c1;">${this.supportPhone}</a><br>
            🕒 Support Hours: Mon-Fri 9AM-6PM EST
          </p>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #95a5a6; font-size: 12px; line-height: 1.4;">
            This email was sent from a notification-only address. Please use our support email for inquiries.<br>
            © ${new Date().getFullYear()} Mera Bestie. All rights reserved.
          </p>
        </div>
      </div>
    `;
    }
    // Order Status: Processing
    sendOrderProcessingEmail(email, orderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Order Confirmation - We're Processing Your Order! 🎉</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${orderDetails.customerName},</p>
      <p style="color: #7f8c8d; font-size: 16px;">Thank you for your order! We've received your payment and are now preparing your items.</p>
      
      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
        <h3 style="color: #155724; margin-top: 0;">Order Details</h3>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745;">Processing</span></p>
        <p style="margin: 5px 0;"><strong>Total:</strong> $${orderDetails.total.toFixed(2)}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Items Ordered:</h3>
        ${orderDetails.items
                .map((item) => `
          <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
            <p style="margin: 5px 0;"><strong>${item.name}</strong></p>
            <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</p>
          </div>
        `)
                .join("")}
      </div>

      <p style="color: #7f8c8d; font-size: 16px;">We'll send you another email once your order has been shipped with tracking information.</p>
    `;
            return this.sendEmail(email, "Order Confirmation - Processing", content);
        });
    }
    // Order Status: Shipped
    sendOrderShippedEmail(email, orderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Your Order is on its Way! 🚚</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${orderDetails.customerName},</p>
      <p style="color: #7f8c8d; font-size: 16px;">Great news! Your order has been shipped and is on its way to you.</p>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">Shipping Information</h3>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #ffc107;">Shipped</span></p>
        <p style="margin: 5px 0;"><strong>Tracking Number:</strong> <span style="background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${orderDetails.trackingNumber || "TRK" + Date.now()}</span></p>
        ${orderDetails.estimatedDelivery
                ? `<p style="margin: 5px 0;"><strong>Estimated Delivery:</strong> ${orderDetails.estimatedDelivery}</p>`
                : ""}
      </div>

      ${orderDetails.shippingAddress
                ? `
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #2c3e50; margin-top: 0;">Shipping Address:</h3>
          <p style="margin: 5px 0; white-space: pre-line;">${orderDetails.shippingAddress}</p>
        </div>
      `
                : ""}

      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background-color: #ffb6c1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Package</a>
      </div>

      <p style="color: #7f8c8d; font-size: 16px;">We'll send you another update once your package has been delivered.</p>
    `;
            return this.sendEmail(email, "Your Order Has Been Shipped!", content);
        });
    }
    // Order Status: Out for Delivery
    sendOrderOutForDeliveryEmail(email, orderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Out for Delivery - Almost There! 📦</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${orderDetails.customerName},</p>
      <p style="color: #7f8c8d; font-size: 16px;">Your package is out for delivery and should arrive today!</p>
      
      <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #155724;">
        <h3 style="color: #155724; margin-top: 0;">Delivery Update</h3>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745;">Out for Delivery</span></p>
        <p style="margin: 5px 0;"><strong>Expected Delivery:</strong> Today</p>
        ${orderDetails.trackingNumber
                ? `<p style="margin: 5px 0;"><strong>Tracking Number:</strong> ${orderDetails.trackingNumber}</p>`
                : ""}
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Delivery Tips:</h3>
        <ul style="color: #666; line-height: 1.6;">
          <li>Someone should be available to receive the package</li>
          <li>Check your doorstep if no one is home</li>
          <li>Contact us immediately if there are any issues</li>
        </ul>
      </div>

      <p style="color: #7f8c8d; font-size: 16px;">Thank you for choosing Mera Bestie!</p>
    `;
            return this.sendEmail(email, "Out for Delivery - Your Order Arrives Today!", content);
        });
    }
    // Order Status: Delivered
    sendOrderDeliveredEmail(email, orderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Order Delivered Successfully! 🎊</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${orderDetails.customerName},</p>
      <p style="color: #7f8c8d; font-size: 16px;">Your order has been successfully delivered! We hope you love your new items.</p>
      
      <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #bee5eb;">
        <h3 style="color: #0c5460; margin-top: 0;">Delivery Confirmation</h3>
        <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745;">✅ Delivered</span></p>
        <p style="margin: 5px 0;"><strong>Delivered on:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background-color: #ffb6c1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">Leave a Review</a>
        <a href="#" style="background-color: #6c757d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; margin: 5px;">Shop Again</a>
      </div>

      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #856404; margin-top: 0;">Love Your Purchase?</h3>
        <p style="margin: 5px 0; color: #666;">Share your experience with other customers! Your review helps us improve and helps others make great choices.</p>
      </div>

      <p style="color: #7f8c8d; font-size: 16px;">Thank you for being a valued customer!</p>
    `;
            return this.sendEmail(email, "Order Delivered - Thank You!", content);
        });
    }
    // Welcome/Registration Email
    sendWelcomeEmail(email, customerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Welcome to Mera Bestie! 💝</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${customerName},</p>
      <p style="color: #7f8c8d; font-size: 16px;">Welcome to the Mera Bestie family! We're thrilled to have you join our community of fashion lovers.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">What's Next?</h3>
        <ul style="color: #666; line-height: 1.8;">
          <li>🛍️ Browse our latest collections</li>
          <li>💝 Get exclusive member discounts</li>
          <li>🔔 Be first to know about new arrivals</li>
          <li>💌 Receive personalized style recommendations</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background-color: #ffb6c1; color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Start Shopping</a>
      </div>

      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #155724; margin-top: 0;">Special Welcome Offer! 🎁</h3>
        <p style="margin: 5px 0; color: #155724; font-weight: bold;">Use code WELCOME15 for 15% off your first order!</p>
        <p style="margin: 5px 0; color: #666; font-size: 14px;">Valid for 30 days from account creation.</p>
      </div>
    `;
            return this.sendEmail(email, "Welcome to Mera Bestie - Your Style Journey Begins!", content);
        });
    }
    // Password Reset Email
    sendPasswordResetEmail(email, resetToken, customerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Password Reset Request 🔐</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${customerName},</p>
      <p style="color: #7f8c8d; font-size: 16px;">We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">Security Notice</h3>
        <p style="margin: 5px 0; color: #856404;">This password reset link will expire in 1 hour for your security.</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #dc3545; color: white; padding: 15px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Reset My Password</a>
      </div>

      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Can't Click the Button?</h3>
        <p style="margin: 5px 0; color: #666; font-size: 14px;">Copy and paste this link into your browser:</p>
        <p style="margin: 5px 0; word-break: break-all; background: #e9ecef; padding: 8px; border-radius: 3px; font-family: monospace; font-size: 12px;">${resetLink}</p>
      </div>

      <p style="color: #7f8c8d; font-size: 16px;">If you're having trouble, please contact our support team.</p>
    `;
            return this.sendEmail(email, "Password Reset Request - Mera Bestie", content);
        });
    }
    // Newsletter/Promotional Email
    sendNewsletterEmail(email, customerName, subject, content, unsubscribeToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe?token=${unsubscribeToken}`;
            const emailContent = `
      <h2 style="color: #2c3e50; margin-top: 0;">${subject}</h2>
      <p style="color: #7f8c8d; font-size: 16px;">Hi ${customerName},</p>
      
      <div style="margin: 20px 0;">
        ${content}
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="#" style="background-color: #ffb6c1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Shop Now</a>
      </div>

      <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <p style="margin: 5px 0; color: #666; font-size: 12px;">
          Don't want to receive these emails? 
          <a href="${unsubscribeLink}" style="color: #ffb6c1;">Unsubscribe here</a>
        </p>
      </div>
    `;
            return this.sendEmail(email, subject, emailContent);
        });
    }
    // Complaint Confirmation (Enhanced version of existing method)
    sendComplaintConfirmationEmail(email, complaintNumber, message, customerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = `
      <h2 style="color: #2c3e50; margin-top: 0;">Complaint Registration Confirmation 📋</h2>
      ${customerName
                ? `<p style="color: #7f8c8d; font-size: 16px;">Hi ${customerName},</p>`
                : ""}
      <p style="color: #7f8c8d; font-size: 16px;">Thank you for reaching out to us! We've received your complaint and our team is reviewing it.</p>
      
      <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #bee5eb;">
        <h3 style="color: #0c5460; margin-top: 0;">Complaint Details</h3>
        <p style="margin: 10px 0;"><strong>Complaint ID:</strong> <span style="background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${complaintNumber}</span></p>
        <p style="margin: 10px 0;"><strong>Status:</strong> <span style="color: #ffc107;">Under Review</span></p>
        <p style="margin: 10px 0;"><strong>Expected Response:</strong> Within 24 hours</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Your Message:</h3>
        <p style="margin: 10px 0; font-style: italic; color: #555; line-height: 1.6;">${message}</p>
      </div>

      <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #155724; margin-top: 0;">What Happens Next?</h3>
        <ol style="color: #666; line-height: 1.6; margin: 10px 0;">
          <li>Our specialist team reviews your complaint</li>
          <li>We investigate the issue thoroughly</li>
          <li>You'll receive a detailed response via email</li>
          <li>If needed, we'll follow up to ensure resolution</li>
        </ol>
      </div>

      <p style="color: #7f8c8d; font-size: 16px;">Please keep your complaint ID for reference. We appreciate your patience as we work to resolve this matter.</p>
    `;
            return this.sendEmail(email, "Complaint Registration Confirmation", content);
        });
    }
    // Generic method to send emails
    sendEmail(email, subject, content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: this.fromEmail,
                    to: email,
                    subject: subject,
                    html: this.getBaseTemplate(content),
                    text: this.stripHtml(content), // Convert HTML to plain text for text version
                    replyTo: this.supportEmail,
                };
                const info = yield this.transporter.sendMail(mailOptions);
                console.log(`Email sent successfully to ${email}:`, info.response);
                return info;
            }
            catch (error) {
                console.error(`Error sending email to ${email}:`, error);
                throw error;
            }
        });
    }
    // Utility method to strip HTML tags for text version
    stripHtml(html) {
        return html
            .replace(/<[^>]*>/g, "")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/\s+/g, " ")
            .trim();
    }
    // Send bulk emails to all users
    sendEmailToAllUsers(subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.find({}, "email name");
                if (users.length === 0) {
                    console.log("No users found to send emails to.");
                    return;
                }
                // Send emails in batches to avoid overwhelming the server
                const batchSize = 50;
                for (let i = 0; i < users.length; i += batchSize) {
                    const batch = users.slice(i, i + batchSize);
                    yield Promise.allSettled(batch.map((user) => this.sendNewsletterEmail(user.email, user.name || "Valued Customer", subject, message, `unsubscribe_${user._id}_${Date.now()}` // Generate unique unsubscribe token
                    )));
                    // Add delay between batches to respect rate limits
                    if (i + batchSize < users.length) {
                        yield new Promise((resolve) => setTimeout(resolve, 1000));
                    }
                }
                console.log(`Bulk emails sent to ${users.length} users.`);
            }
            catch (error) {
                console.error("Error sending bulk emails:", error);
                throw error;
            }
        });
    }
    // Test email configuration
    testEmailConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.verify();
                console.log("Email server connection verified successfully");
                return true;
            }
            catch (error) {
                console.error("Email server connection failed:", error);
                return false;
            }
        });
    }
}
exports.EmailService = EmailService;
