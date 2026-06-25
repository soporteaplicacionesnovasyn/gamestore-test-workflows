"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
vitest_1.vi.mock('../middleware/auth', () => ({
    authenticate: vitest_1.vi.fn((req, _res, next) => {
        req.userId = 1;
        next();
    }),
    AuthRequest: {},
}));
const mockPrisma = {
    product: { findUnique: vitest_1.vi.fn(), update: vitest_1.vi.fn() },
    cart: { findUnique: vitest_1.vi.fn(), create: vitest_1.vi.fn() },
    cartItem: { findFirst: vitest_1.vi.fn(), update: vitest_1.vi.fn(), create: vitest_1.vi.fn(), deleteMany: vitest_1.vi.fn() },
    $transaction: vitest_1.vi.fn(cb => cb(mockPrisma)),
};
vitest_1.vi.mock('@prisma/client', () => ({
    PrismaClient: function () { return mockPrisma; },
}));
(0, vitest_1.describe)('Cart - Stock Validation', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { default: router } = await Promise.resolve().then(() => __importStar(require('../routes/cart')));
        app.use('/api/cart', router);
    });
    (0, vitest_1.it)('should add item when quantity <= stock', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 10, stock: 5 });
        mockPrisma.cartItem.findFirst.mockResolvedValueOnce(null);
        mockPrisma.cartItem.create.mockResolvedValueOnce({ id: 1, cartId: 1, productId: 10, quantity: 3 });
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, items: [{ id: 1, productId: 10, quantity: 3, product: { id: 10, name: 'Game', stock: 5 } }] });
        const res = await (0, supertest_1.default)(app).post('/api/cart/add').send({ productId: 10, quantity: 3 }).expect(200);
        (0, vitest_1.expect)(res.body).toBeDefined();
    });
    (0, vitest_1.it)('should reject when quantity > stock', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 10, stock: 2 });
        mockPrisma.cartItem.findFirst.mockResolvedValueOnce(null);
        const res = await (0, supertest_1.default)(app).post('/api/cart/add').send({ productId: 10, quantity: 5 }).expect(400);
        (0, vitest_1.expect)(res.body).toEqual({ error: 'Insufficient stock', productId: 10, available: 2 });
    });
    (0, vitest_1.it)('should reject when product not found', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
        mockPrisma.product.findUnique.mockResolvedValueOnce(null);
        const res = await (0, supertest_1.default)(app).post('/api/cart/add').send({ productId: 999, quantity: 1 }).expect(400);
        (0, vitest_1.expect)(res.body).toEqual({ error: 'Product not found' });
    });
    (0, vitest_1.it)('should reject when total qty > stock (existing + new)', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 10, stock: 5 });
        mockPrisma.cartItem.findFirst.mockResolvedValueOnce({ id: 1, cartId: 1, productId: 10, quantity: 4 });
        const res = await (0, supertest_1.default)(app).post('/api/cart/add').send({ productId: 10, quantity: 2 }).expect(400);
        (0, vitest_1.expect)(res.body).toEqual({ error: 'Insufficient stock', productId: 10, available: 5 });
    });
});
