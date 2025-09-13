"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERole = exports.ELoginStatus = exports.EBusinessType = void 0;
// Define the business type enum
var EBusinessType;
(function (EBusinessType) {
    EBusinessType["RETAIL"] = "retail";
    EBusinessType["WHOLESALE"] = "wholesale";
    EBusinessType["MANUFACTURING"] = "manufacturing";
    EBusinessType["SERVICE"] = "service";
    EBusinessType["OTHER"] = "other";
})(EBusinessType || (exports.EBusinessType = EBusinessType = {}));
// Define the login status enum
var ELoginStatus;
(function (ELoginStatus) {
    ELoginStatus["LOGGED_IN"] = "loggedin";
    ELoginStatus["LOGGED_OUT"] = "loggedout";
})(ELoginStatus || (exports.ELoginStatus = ELoginStatus = {}));
// Define the Role
var ERole;
(function (ERole) {
    ERole["ADMIN"] = "admin";
    ERole["MANAGER"] = "manager";
    ERole["SELLER"] = "seller";
})(ERole || (exports.ERole = ERole = {}));
