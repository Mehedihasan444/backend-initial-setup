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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const paginationHelper_1 = require("../../utils/paginationHelper");
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.product.create({
        data: payload,
    });
    return result;
});
const getAllProductsFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
            ],
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        include: {
            category: true,
            shop: true,
        },
    });
    const total = yield prisma_1.default.product.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id },
    });
    return product;
});
const deleteProductFromDB = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    if (product.isDeleted) {
        throw new Error("This product is already marked as deleted.");
    }
    const result = yield prisma_1.default.product.update({
        where: { id: productId },
        data: { isDeleted: true },
    });
    return result;
});
const updateProduct = (productId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield prisma_1.default.product.findUniqueOrThrow({
        where: { id: productId },
    });
    const result = yield prisma_1.default.product.update({
        where: { id: productId },
        data: payload,
    });
    return result;
});
exports.ProductServices = {
    createProduct,
    getAllProductsFromDB,
    getSingleProductFromDB,
    deleteProductFromDB,
    updateProduct,
};
