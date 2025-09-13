import { Schema, model, Document } from "mongoose";
import { EBusinessType, ELoginStatus, ERole } from "../enums";

export interface ShiprocketAuthResponse {
	token: string;
	expires_at: string;
}

export interface ShiprocketOrder {
	order_id: string;
	shipment_id: string;
}

export interface CartItem {
	variant_id: string;
	quantity: number;
}

export interface CartData {
	items: CartItem[];
}

export interface Product {
	_id: string;
	productId: string;
	name: string;
	price: number;
	category: string;
	inStockValue: number;
	soldStockValue: number;
	img: string;
	rating: number;
	visibility: "on" | "off";
}

export interface CartProduct {
	productId: string;
	quantity: number;
	price: number;
	name: string;
	category: string;
	img: string[];
}

export interface OrderDetails {
	orderId: string;
	trackingDetails?: {
		provider: string;
		trackingNumber: string;
		status: string;
	};
}
export interface ICart extends Document {
	cartId: string;
	userId: string;
	productsInCart: CartProduct[];
	total: number;
	updatedAt: Date;
}

export interface IOrder extends Document {
	orderId: string;
	userId: string;
	date: string;
	time: string;
	address: string;
	email: string;
	name: string;
	productIds: string[];
	products: {
		productId: string;
		name: string;
		price: number;
		quantity: number;
		img: string[];
		category: string;
	}[];
	trackingId?: string;
	price: number;
	status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
	paymentStatus: "Paid" | "Unpaid" | "Failed" | "Refunded" | "Pending";
	createdAt: Date;
	updatedAt?: Date;
	paymentMethod?: "Credit Card" | "Debit Card" | "Net Banking" | "UPI" | "COD";
	paymentReference?: string;
}

export interface IProduct extends Document {
	name: string;
	price: number;
	img: string[];
	category: string;
	description: string;
	rating: number;
	productId: string;
	inStockValue: number;
	soldStockValue: number;
	visibility: "on" | "off";
}

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	userId: string;
	accountStatus: string;
	phone: string;
	comparePassword(password: string): Promise<boolean>;
}

export interface IReview extends Document {
	productId: string;
	userId: string;
	review: string;
	rating: number;
	verified: boolean;
	createdAt: Date;
}

export interface ICoupon extends Document {
	code: string;
	discountPercentage: number;
	name: string;
	status: "active" | "expired" | "disabled";
}

export interface IComplaint extends Document {
	complaintNumber: string;
	name: string;
	email: string;
	message: string;
	userType: string;
	status: "pending" | "in-progress" | "resolved" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

// Define Seller interface extending Document
export interface ISeller extends Document {
	name: string;
	email: string;
	password: string;
	sellerId: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	phoneNumber: string;
	businessName: string;
	businessAddress: string;
	businessType?: EBusinessType;
	otp?: string;
	role: ERole;
	loggedIn: ELoginStatus;
	comparePassword(password: string): Promise<boolean>;
}

export interface ISellerRegistrationDTO {
	name: string;
	email: string;
	password: string;
	phoneNumber: string;
	businessName: string;
	businessAddress: string;
	businessType: EBusinessType;
}

export interface ISellerLoginDTO {
	email: string;
	password: string;
}

export interface ISellerResponseDTO {
	id: string;
	name: string;
	email: string;
	sellerId: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	phoneNumber: string;
	businessName: string;
	businessAddress: string;
	businessType: string;
}

export interface IVerifyOtpDTO {
	email: string;
	otp: string;
	type: "email" | "phone";
}

export interface IUpdateSellerDTO {
	name?: string;
	phoneNumber?: string;
	businessName?: string;
	businessAddress?: string;
	businessType?: EBusinessType;
}

export interface IChangePasswordDTO {
	currentPassword: string;
	newPassword: string;
}

export interface IApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}




// Email Types and Interfaces

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress?: string;
  orderDate?: Date;
  paymentMethod?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  discounts?: number;
  couponCode?: string;
}

export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  sku?: string;
  variant?: string;
  color?: string;
  size?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  templateId: string;
  category: EmailCategory;
}

export enum EmailCategory {
  TRANSACTIONAL = "transactional",
  PROMOTIONAL = "promotional",
  NOTIFICATION = "notification",
  SYSTEM = "system",
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export interface ComplaintDetails {
  complaintId?: string;
  email: string;
  customerName?: string;
  subject?: string;
  message: string;
  category?: ComplaintCategory;
  priority?: Priority;
  attachments?: string[];
}

export enum ComplaintCategory {
  ORDER_ISSUE = "order_issue",
  PRODUCT_QUALITY = "product_quality",
  SHIPPING = "shipping",
  BILLING = "billing",
  TECHNICAL = "technical",
  GENERAL = "general",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface WelcomeEmailData {
  email: string;
  customerName: string;
  welcomeOffer?: {
    code: string;
    discount: number;
    expiryDays: number;
  };
  referralCode?: string;
}

export interface PasswordResetData {
  email: string;
  customerName: string;
  resetToken: string;
  expirationTime?: number; // in hours
}

export interface NewsletterData {
  email: string;
  customerName: string;
  subject: string;
  content: string;
  unsubscribeToken: string;
  previewText?: string;
  ctaButton?: {
    text: string;
    url: string;
  };
  images?: string[];
}

export interface BulkEmailData {
  subject: string;
  content: string;
  htmlContent?: string;
  segment?: UserSegment;
  scheduledTime?: Date;
  campaignId?: string;
}

export enum UserSegment {
  ALL_USERS = "all_users",
  ACTIVE_CUSTOMERS = "active_customers",
  NEW_CUSTOMERS = "new_customers",
  VIP_CUSTOMERS = "vip_customers",
  INACTIVE_CUSTOMERS = "inactive_customers",
}

export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  failed: number;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  segment: UserSegment;
  status: CampaignStatus;
  scheduledTime?: Date;
  sentTime?: Date;
  stats: EmailStats;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  SENDING = "sending",
  SENT = "sent",
  CANCELLED = "cancelled",
}

// Email service configuration
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
}

// Email queue job interface
export interface EmailJob {
  id: string;
  type: EmailJobType;
  priority: number;
  data: any;
  attempts: number;
  maxAttempts: number;
  delay?: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export enum EmailJobType {
  SINGLE_EMAIL = "single_email",
  BULK_EMAIL = "bulk_email",
  ORDER_STATUS = "order_status",
  WELCOME = "welcome",
  PASSWORD_RESET = "password_reset",
  COMPLAINT_CONFIRMATION = "complaint_confirmation",
  NEWSLETTER = "newsletter",
}

// API Response interfaces
export interface EmailResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp?: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Webhook interfaces for email events
export interface EmailWebhookPayload {
  eventType: EmailEventType;
  email: string;
  messageId: string;
  timestamp: Date;
  campaignId?: string;
  metadata?: Record<string, any>;
}

export enum EmailEventType {
  SENT = "sent",
  DELIVERED = "delivered",
  OPENED = "opened",
  CLICKED = "clicked",
  BOUNCED = "bounced",
  UNSUBSCRIBED = "unsubscribed",
  SPAM_REPORT = "spam_report",
  DROPPED = "dropped",
}

// Unsubscribe management
export interface UnsubscribeData {
  email: string;
  token: string;
  reason?: string;
  categories?: EmailCategory[];
  unsubscribeAll?: boolean;
}

// Email personalization
export interface PersonalizationData {
  customerName?: string;
  firstName?: string;
  lastName?: string;
  customFields?: Record<string, any>;
  preferences?: UserPreferences;
  orderHistory?: OrderSummary[];
  loyaltyPoints?: number;
  membershipTier?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  emailFrequency: EmailFrequency;
  categories: EmailCategory[];
}

export enum EmailFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  NEVER = "never",
}

export interface OrderSummary {
  orderId: string;
  date: Date;
  total: number;
  status: OrderStatus;
  itemCount: number;
}

// Email template variables
export interface TemplateVariables {
  [key: string]: any;
  customerName?: string;
  orderId?: string;
  trackingNumber?: string;
  companyName?: string;
  supportEmail?: string;
  supportPhone?: string;
  websiteUrl?: string;
  unsubscribeUrl?: string;
  currentYear?: number;
}