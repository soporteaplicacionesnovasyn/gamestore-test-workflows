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
    order: { create: vitest_1.vi.fn(), findMany: vitest_1.vi.fn(), findFirst: vitest_1.vi.fn() },
    $transaction: vitest_1.vi.fn(cb => cb(mockPrisma)),
};
vitest_1.vi.mock('@prisma/client', () => ({
    PrismaClient: function () { return mockPrisma; },
}));
(0, vitest_1.describe)('Orders - Stock Validation', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { default: router } = await Promise.resolve().then(() => __importStar(require('../routes/orders')));
        app.use('/api/orders', router);
    });
    (0, vitest_1.it)('should succeed when stock is sufficient', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [{ id: 1, productId: 10, quantity: 2, product: { id: 10, name: 'Game', price: '29.99', stock: 10 } }] });
        mockPrisma.product.update.mockResolvedValueOnce({ id: 10, stock: 8 });
        mockPrisma.cartItem.deleteMany.mockResolvedValueOnce({ count: 1 });
        mockPrisma.order.create.mockResolvedValueOnce({ id: 1, userId: 1, total: 59.98, status: 'pending', items: [{ id: 1, productId: 10, quantity: 2, price: 29.99 }] });
        const res = await (0, supertest_1.default)(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(201);
        (0, vitest_1.expect)(res.body.status).toBe('pending');
        (0, vitest_1.expect)(mockPrisma.product.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { stock: { decrement: 2 } } });
        (0, vitest_1.expect)(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 1 } });
        (0, vitest_1.expect)(mockPrisma.).toHaveBeenCalled();
    });
    (0, vitest_1.it)('should reject when stock is insufficient', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [{ id: 1, productId: 10, quantity: 15, product: { id: 10, name: 'Game', price: '29.99', stock: 10 } }] });
        const res = await (0, supertest_1.default)(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(400);
        (0, vitest_1.expect)(res.body).toEqual({ error: 'Insufficient stock', products: [{ productId: 10, name: 'Game', available: 10, requested: 15 }] });
        (0, vitest_1.expect)(mockPrisma.).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)('should reject when cart is empty', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [] });
        const res = await (0, supertest_1.default)(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(400);
        (0, vitest_1.expect)(res.body).toEqual({ error: 'Cart is empty' });
    });
    (0, vitest_1.it)('should handle multiple items with one insufficient', async () => {
        mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [
                { id: 1, productId: 10, quantity: 2, product: { id: 10, name: 'Game A', price: '29.99', stock: 10 } },
                { id: 2, productId: 11, quantity: 20, product: { id: 11, name: 'Game B', price: '19.99', stock: 5 } },
            ] });
        const res = await (0, supertest_1.default)(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(400);
        (0, vitest_1.expect)(res.body.error).toBe('Insufficient stock');
        (0, vitest_1.expect)(res.body.products).toHaveLength(1);
        (0, vitest_1.expect)(res.body.products[0].productId).toBe(11);
    });
});
