"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const category_controller_1 = require("./category.controller"); // Adjust the import path
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
exports.CategoryRoutes = router;
// Route to create a new category (only accessible by Admins)
router.post("/", (0, auth_1.default)(client_1.Role.ADMIN), sendImageToCloudinary_1.upload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, 
// validateRequest(categoryValidationSchema.createCategoryValidationSchema),
category_controller_1.CategoryControllers.createCategory);
// Route to get all categories (publicly accessible)
router.get("/", category_controller_1.CategoryControllers.getAllCategories);
// Route to get a single category (publicly accessible)
router.get("/:id", category_controller_1.CategoryControllers.getSingleCategory);
// Route to update a category (only accessible by Admins)
router.patch("/:id", (0, auth_1.default)(client_1.Role.ADMIN), sendImageToCloudinary_1.upload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, 
// validateRequest(categoryValidationSchema.updateCategoryValidationSchema),
category_controller_1.CategoryControllers.updateCategory);
// Route to delete a category (only accessible by Admins)
router.delete("/:id", (0, auth_1.default)(client_1.Role.ADMIN), category_controller_1.CategoryControllers.deleteCategory);
