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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var nodemail_1 = require("./nodemail");
var mysql_1 = require("../Mysql/mysql");
var verify_user_1 = require("./verify_user");
var verify_cookies_1 = require("./verify_cookies");
var router = express.Router();
var mysql = new mysql_1.Mysql();
var cookies_data;
router.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var v, is_admin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                v = new verify_cookies_1.Cookies(req, res);
                cookies_data = v.verify();
                return [4 /*yield*/, mysql.is_admin(cookies_data.cookies_privilege)];
            case 1:
                is_admin = _a.sent();
                if (!(!is_admin || cookies_data.cookies_privilege === "admin")) {
                    cookies_data.cookies_privilege === null;
                }
                next();
                return [2 /*return*/];
        }
    });
}); });
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("index", {
            cookies_data: cookies_data
        });
        return [2 /*return*/];
    });
}); });
router.post("/exit", function (req, res) {
    res.clearCookie("user_data");
    res.redirect("/");
});
router.post("/req-page-progress", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, user_value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mysql.find_user(req.body.name, req.body.password)];
            case 1:
                user = _a.sent();
                if (!req.body)
                    return [2 /*return*/, res.sendStatus(400)];
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, mysql.find_user_val(req.body.name, req.body.password)];
            case 2:
                user_value = _a.sent();
                res.cookie("user_data", { cookies_have: user, cookies_name: user_value[0].NAME, cookies_password: user_value[0].PASSWORD, cookies_mail: user_value[0].MAIL, cookies_privilege: user_value[0].PRIVILEGE });
                res.redirect("/");
                return [3 /*break*/, 4];
            case 3:
                res.json(false);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/registration-process", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var new_user, verify, exist, _a, message, mail;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                new_user = new verify_user_1.Verify(req.body);
                verify = new_user.verify() && new_user.is_empty();
                if (!verify) {
                    return [2 /*return*/, res.json(verify)];
                }
                if (!req.body)
                    return [2 /*return*/, res.sendStatus(400)];
                return [4 /*yield*/, mysql.find_one(req.body.name)];
            case 1:
                _a = (_b.sent());
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, mysql.find_one(req.body.email)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                exist = _a;
                message = {
                    from: "ilyaspiypiy@gmail.com",
                    to: req.body.email,
                    subject: "Test",
                    text: "работает"
                };
                if (!exist) {
                    return [2 /*return*/, res.json(exist)];
                }
                mail = new nodemail_1.Mail(message);
                mail.send();
                mysql.save_user(req.body.name, req.body.password, req.body.email);
                return [2 /*return*/, res.json(exist)];
        }
    });
}); });
exports["default"] = router;
