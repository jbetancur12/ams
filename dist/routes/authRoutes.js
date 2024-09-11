"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("@controllers/authController");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('Hello Worlds!');
});
router.post('/register-admin', authController_1.registerAdmin);
router.post('/login', authController_1.login);
exports.default = router;
