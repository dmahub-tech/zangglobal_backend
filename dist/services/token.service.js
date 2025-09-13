"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistToken = blacklistToken;
exports.isTokenBlacklisted = isTokenBlacklisted;
const blacklistedTokens = new Set();
function blacklistToken(token) {
    blacklistedTokens.add(token);
}
function isTokenBlacklisted(token) {
    return blacklistedTokens.has(token);
}
