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
const mockPrisma = {
    product: {
        findMany: vitest_1.vi.fn(),
        count: vitest_1.vi.fn(),
        findUnique: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
    },
    rating: {
        groupBy: vitest_1.vi.fn(),
        upsert: vitest_1.vi.fn(),
        aggregate: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
    },
};
vitest_1.vi.mock('@prisma/client', () => ({
    PrismaClient: function () {
        return mockPrisma;
    },
}));
(0, vitest_1.describe)('Products - Search', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        mockPrisma.rating.groupBy.mockResolvedValue([]);
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { default: router } = await Promise.resolve().then(() => __importStar(require('../routes/products')));
        app.use('/api/products', router);
    });
    (0, vitest_1.it)('should filter products by name using contains', async () => {
        mockPrisma.product.findMany.mockResolvedValueOnce([
            { id: 1, name: 'Adventure Quest', price: 29.99, category: 'Adventure' },
        ]);
        mockPrisma.product.count.mockResolvedValueOnce(1);
        const res = await (0, supertest_1.default)(app)
            .get('/api/products?search=adv')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.products).toHaveLength(1);
        (0, vitest_1.expect)(res.body.data.products[0].name).toBe('Adventure Quest');
    });
    (0, vitest_1.it)('should return empty list when search matches nothing', async () => {
        mockPrisma.product.findMany.mockResolvedValueOnce([]);
        mockPrisma.product.count.mockResolvedValueOnce(0);
        const res = await (0, supertest_1.default)(app)
            .get('/api/products?search=zzznotfound')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.products).toHaveLength(0);
        (0, vitest_1.expect)(res.body.data.total).toBe(0);
    });
    (0, vitest_1.it)('should return all products when search is empty', async () => {
        mockPrisma.product.findMany.mockResolvedValueOnce([
            { id: 1, name: 'Game A', price: 19.99, category: 'Action' },
            { id: 2, name: 'Game B', price: 29.99, category: 'RPG' },
        ]);
        mockPrisma.product.count.mockResolvedValueOnce(2);
        const res = await (0, supertest_1.default)(app)
            .get('/api/products')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.products).toHaveLength(2);
        (0, vitest_1.expect)(res.body.data.total).toBe(2);
    });
    (0, vitest_1.it)('should combine search with category filter', async () => {
        mockPrisma.product.findMany.mockResolvedValueOnce([
            { id: 3, name: 'Adventure World', price: 39.99, category: 'Adventure' },
        ]);
        mockPrisma.product.count.mockResolvedValueOnce(1);
        const res = await (0, supertest_1.default)(app)
            .get('/api/products?search=adventure&category=Adventure')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.products).toHaveLength(1);
        const whereArg = mockPrisma.product.findMany.mock.calls[0][0].where;
        (0, vitest_1.expect)(whereArg.name).toBeDefined();
        (0, vitest_1.expect)(whereArg.category).toBe('Adventure');
    });
    (0, vitest_1.it)('should be case-insensitive', async () => {
        mockPrisma.product.findMany.mockResolvedValueOnce([
            { id: 4, name: 'Adventure Quest', price: 29.99, category: 'Adventure' },
        ]);
        mockPrisma.product.count.mockResolvedValueOnce(1);
        const resUppercase = await (0, supertest_1.default)(app)
            .get('/api/products?search=ADVENTURE')
            .expect(200);
        (0, vitest_1.expect)(resUppercase.body.success).toBe(true);
        (0, vitest_1.expect)(mockPrisma.product.findMany).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            where: vitest_1.expect.objectContaining({
                name: vitest_1.expect.objectContaining({ contains: 'ADVENTURE' }),
            }),
        }));
    });
    (0, vitest_1.it)('should trim whitespace from search input', async () => {
        mockPrisma.product.findMany.mockResolvedValueOnce([]);
        mockPrisma.product.count.mockResolvedValueOnce(0);
        await (0, supertest_1.default)(app)
            .get('/api/products?search=  zelda  ')
            .expect(200);
        const whereArg = mockPrisma.product.findMany.mock.calls[0][0].where;
        (0, vitest_1.expect)(whereArg.name.contains).toBe('zelda');
    });
    (0, vitest_1.it)('should return success false on server error', async () => {
        mockPrisma.product.findMany.mockRejectedValueOnce(new Error('Database error'));
        const res = await (0, supertest_1.default)(app)
            .get('/api/products?search=test')
            .expect(500);
        (0, vitest_1.expect)(res.body.success).toBe(false);
        (0, vitest_1.expect)(res.body.error).toBeDefined();
    });
});
