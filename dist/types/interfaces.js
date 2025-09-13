"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailFrequency = exports.EmailEventType = exports.EmailJobType = exports.CampaignStatus = exports.UserSegment = exports.Priority = exports.ComplaintCategory = exports.OrderStatus = exports.EmailCategory = void 0;
var EmailCategory;
(function (EmailCategory) {
    EmailCategory["TRANSACTIONAL"] = "transactional";
    EmailCategory["PROMOTIONAL"] = "promotional";
    EmailCategory["NOTIFICATION"] = "notification";
    EmailCategory["SYSTEM"] = "system";
})(EmailCategory || (exports.EmailCategory = EmailCategory = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["PROCESSING"] = "processing";
    OrderStatus["SHIPPED"] = "shipped";
    OrderStatus["OUT_FOR_DELIVERY"] = "out_for_delivery";
    OrderStatus["DELIVERED"] = "delivered";
    OrderStatus["CANCELLED"] = "cancelled";
    OrderStatus["REFUNDED"] = "refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var ComplaintCategory;
(function (ComplaintCategory) {
    ComplaintCategory["ORDER_ISSUE"] = "order_issue";
    ComplaintCategory["PRODUCT_QUALITY"] = "product_quality";
    ComplaintCategory["SHIPPING"] = "shipping";
    ComplaintCategory["BILLING"] = "billing";
    ComplaintCategory["TECHNICAL"] = "technical";
    ComplaintCategory["GENERAL"] = "general";
})(ComplaintCategory || (exports.ComplaintCategory = ComplaintCategory = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
    Priority["URGENT"] = "urgent";
})(Priority || (exports.Priority = Priority = {}));
var UserSegment;
(function (UserSegment) {
    UserSegment["ALL_USERS"] = "all_users";
    UserSegment["ACTIVE_CUSTOMERS"] = "active_customers";
    UserSegment["NEW_CUSTOMERS"] = "new_customers";
    UserSegment["VIP_CUSTOMERS"] = "vip_customers";
    UserSegment["INACTIVE_CUSTOMERS"] = "inactive_customers";
})(UserSegment || (exports.UserSegment = UserSegment = {}));
var CampaignStatus;
(function (CampaignStatus) {
    CampaignStatus["DRAFT"] = "draft";
    CampaignStatus["SCHEDULED"] = "scheduled";
    CampaignStatus["SENDING"] = "sending";
    CampaignStatus["SENT"] = "sent";
    CampaignStatus["CANCELLED"] = "cancelled";
})(CampaignStatus || (exports.CampaignStatus = CampaignStatus = {}));
var EmailJobType;
(function (EmailJobType) {
    EmailJobType["SINGLE_EMAIL"] = "single_email";
    EmailJobType["BULK_EMAIL"] = "bulk_email";
    EmailJobType["ORDER_STATUS"] = "order_status";
    EmailJobType["WELCOME"] = "welcome";
    EmailJobType["PASSWORD_RESET"] = "password_reset";
    EmailJobType["COMPLAINT_CONFIRMATION"] = "complaint_confirmation";
    EmailJobType["NEWSLETTER"] = "newsletter";
})(EmailJobType || (exports.EmailJobType = EmailJobType = {}));
var EmailEventType;
(function (EmailEventType) {
    EmailEventType["SENT"] = "sent";
    EmailEventType["DELIVERED"] = "delivered";
    EmailEventType["OPENED"] = "opened";
    EmailEventType["CLICKED"] = "clicked";
    EmailEventType["BOUNCED"] = "bounced";
    EmailEventType["UNSUBSCRIBED"] = "unsubscribed";
    EmailEventType["SPAM_REPORT"] = "spam_report";
    EmailEventType["DROPPED"] = "dropped";
})(EmailEventType || (exports.EmailEventType = EmailEventType = {}));
var EmailFrequency;
(function (EmailFrequency) {
    EmailFrequency["DAILY"] = "daily";
    EmailFrequency["WEEKLY"] = "weekly";
    EmailFrequency["MONTHLY"] = "monthly";
    EmailFrequency["NEVER"] = "never";
})(EmailFrequency || (exports.EmailFrequency = EmailFrequency = {}));
