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
        findUnique: vitest_1.vi.fn(),
    },
    rating: {
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
vitest_1.vi.mock('../middleware/auth', () => ({
    authenticate: (req, res, next) => {
        req.userId = 1;
        req.userRole = 'user';
        next();
    },
    AuthRequest: {},
}));
(0, vitest_1.describe)('Products - Rating', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { default: router } = await Promise.resolve().then(() => __importStar(require('../routes/ratings')));
        app.use('/api/products', router);
    });
    (0, vitest_1.it)('should rate a product successfully', async () => {
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
        mockPrisma.rating.upsert.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, score: 4 });
        mockPrisma.rating.aggregate.mockResolvedValueOnce({ _avg: { score: 4 }, _count: { score: 1 } });
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/rate')
            .send({ score: 4 })
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.averageRating).toBe(4);
        (0, vitest_1.expect)(res.body.data.totalRatings).toBe(1);
    });
    (0, vitest_1.it)('should update an existing rating', async () => {
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
        mockPrisma.rating.upsert.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, score: 2 });
        mockPrisma.rating.aggregate.mockResolvedValueOnce({ _avg: { score: 2 }, _count: { score: 1 } });
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/rate')
            .send({ score: 2 })
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(mockPrisma.rating.upsert).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
            where: { userId_productId: { userId: 1, productId: 1 } },
            update: { score: 2 },
            create: { userId: 1, productId: 1, score: 2 },
        }));
    });
    (0, vitest_1.it)('should reject invalid score', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/rate')
            .send({ score: 6 })
            .expect(400);
        (0, vitest_1.expect)(res.body.error).toBe('Score must be between 1 and 5');
    });
    (0, vitest_1.it)('should return 404 for nonexistent product', async () => {
        mockPrisma.product.findUnique.mockResolvedValueOnce(null);
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/999/rate')
            .send({ score: 3 })
            .expect(404);
        (0, vitest_1.expect)(res.body.error).toBe('Product not found');
    });
});
