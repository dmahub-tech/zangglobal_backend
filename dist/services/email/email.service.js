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
    sendEmailToAllUsers(subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch all user emails from MongoDB
                const users = yield user_model_1.default.find({}, "email");
                const emailAddresses = users.map((user) => user.email);
                if (emailAddresses.length === 0) {
                    console.log("No email addresses found.");
                    return;
                }
                yield this.transporter.sendMail({
                    from: "Zangglobal@gmail.com",
                    to: emailAddresses.join(","),
                    subject: subject,
                    text: message,
                });
                console.log(`Emails successfully sent to ${emailAddresses.length} users.`);
            }
            catch (error) {
                console.error("Error sending emails:", error);
            }
        });
    }
    sendComplaintConfirmationEmail(email, complaintNumber, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOptions = {
                    from: '"Mera Bestie" <pecommerce8@gmail.com>',
                    to: email,
                    subject: "Complaint Registration Confirmation",
                    html: `
          <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #ffffff;">
            <!-- Stylish Header -->
            <div style="background-color: #ffb6c1; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="font-family: 'Brush Script MT', cursive; color: #ffffff; font-size: 36px; margin: 0;">Mera Bestie</h1>
            </div>
            
            <!-- Main Content -->
            <div style="padding: 20px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Complaint Registration Confirmation</h2>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Complaint ID:</strong> ${complaintNumber}</p>
                <p style="margin: 10px 0;"><strong>Issue Description:</strong></p>
                <p style="margin: 10px 0; font-style: italic; color: #555;">${message}</p>
              </div>
              <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                Thank you for reaching out to us! Our experienced specialists are already working on resolving your issue. You can expect a detailed reply to your query within 24 hours. We appreciate your patience and understanding.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #95a5a6; font-size: 12px; line-height: 1.4;">
                This is an automated email. Please do not reply to this message.<br>
                If you have any additional questions, feel free to contact our support team.
              </p>
            </div>
          </div>
        `,
                    text: `
          Mera Bestie

          Complaint Registration Confirmation

          Complaint ID: ${complaintNumber}

          Issue Description:
          ${message}

          Thank you for reaching out to us! Our experienced specialists are already working on resolving your issue. You can expect a detailed reply to your query within 24 hours. We appreciate your patience and understanding.

          This is an automated email. Please do not reply to this message.
          If you have any additional questions, feel free to contact our support team.
        `,
                };
                const info = yield this.transporter.sendMail(mailOptions);
                console.log("Confirmation email sent successfully:", info.response);
                return info;
            }
            catch (error) {
                console.error("Error sending confirmation email:", error);
                throw error;
            }
        });
    }
}
exports.EmailService = EmailService;
