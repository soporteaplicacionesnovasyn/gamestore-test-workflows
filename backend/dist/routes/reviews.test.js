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
    },
    review: {
        create: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
        findUnique: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
        count: vitest_1.vi.fn(),
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
(0, vitest_1.describe)('Reviews - CRUD', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { default: router } = await Promise.resolve().then(() => __importStar(require('../routes/reviews')));
        app.use('/api/products', router);
    });
    (0, vitest_1.it)('should create a review successfully', async () => {
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
        mockPrisma.rating.upsert.mockResolvedValueOnce({});
        mockPrisma.review.create.mockResolvedValueOnce({
            id: 1,
            userId: 1,
            productId: 1,
            title: 'Great game',
            body: 'Really enjoyed it',
            score: 5,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: { id: 1, name: 'Test User' },
        });
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/reviews')
            .send({ title: 'Great game', body: 'Really enjoyed it', score: 5 })
            .expect(201);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.title).toBe('Great game');
        (0, vitest_1.expect)(res.body.data.status).toBe('pending');
    });
    (0, vitest_1.it)('should reject review with invalid score', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/reviews')
            .send({ title: 'Great game', body: 'Really enjoyed it', score: 6 })
            .expect(400);
        (0, vitest_1.expect)(res.body.error).toBe('Score must be an integer between 1 and 5');
    });
    (0, vitest_1.it)('should reject review with empty title', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/reviews')
            .send({ title: '', body: 'Really enjoyed it', score: 4 })
            .expect(400);
        (0, vitest_1.expect)(res.body.error).toBe('Title must be between 1 and 100 characters');
    });
    (0, vitest_1.it)('should reject review with missing body', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/1/reviews')
            .send({ title: 'Great game', score: 4 })
            .expect(400);
        (0, vitest_1.expect)(res.body.error).toBe('Body must be between 1 and 2000 characters');
    });
    (0, vitest_1.it)('should return 404 for nonexistent product', async () => {
        mockPrisma.product.findUnique.mockResolvedValueOnce(null);
        const res = await (0, supertest_1.default)(app)
            .post('/api/products/999/reviews')
            .send({ title: 'Great game', body: 'Really enjoyed it', score: 4 })
            .expect(404);
        (0, vitest_1.expect)(res.body.error).toBe('Product not found');
    });
    (0, vitest_1.it)('should get paginated reviews', async () => {
        mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
        mockPrisma.review.findMany.mockResolvedValueOnce([
            { id: 1, title: 'Great', body: 'Nice', score: 5, status: 'approved', createdAt: new Date().toISOString(), user: { id: 1, name: 'User' } },
        ]);
        mockPrisma.review.count.mockResolvedValueOnce(1);
        mockPrisma.rating.aggregate.mockResolvedValueOnce({ _avg: { score: 5 }, _count: { score: 1 } });
        const res = await (0, supertest_1.default)(app)
            .get('/api/products/1/reviews?page=1&limit=10')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.reviews).toHaveLength(1);
        (0, vitest_1.expect)(res.body.data.total).toBe(1);
    });
    (0, vitest_1.it)('should update own review', async () => {
        mockPrisma.review.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, title: 'Old', body: 'Old body', score: 3 });
        mockPrisma.rating.upsert.mockResolvedValueOnce({});
        mockPrisma.review.update.mockResolvedValueOnce({
            id: 1, userId: 1, productId: 1, title: 'Updated', body: 'Updated body', score: 4, status: 'pending',
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
            user: { id: 1, name: 'Test User' },
        });
        const res = await (0, supertest_1.default)(app)
            .put('/api/products/1/reviews/1')
            .send({ title: 'Updated', body: 'Updated body', score: 4 })
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.title).toBe('Updated');
    });
    (0, vitest_1.it)('should reject update of another user review', async () => {
        mockPrisma.review.findUnique.mockResolvedValueOnce({ id: 1, userId: 2, productId: 1 });
        const res = await (0, supertest_1.default)(app)
            .put('/api/products/1/reviews/1')
            .send({ title: 'Updated' })
            .expect(403);
        (0, vitest_1.expect)(res.body.error).toBe('You can only edit your own reviews');
    });
    (0, vitest_1.it)('should delete own review', async () => {
        mockPrisma.review.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1 });
        mockPrisma.review.delete.mockResolvedValueOnce({});
        const res = await (0, supertest_1.default)(app)
            .delete('/api/products/1/reviews/1')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
    });
});
