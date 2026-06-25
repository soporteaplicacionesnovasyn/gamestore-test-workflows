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
    review: {
        findMany: vitest_1.vi.fn(),
        findUnique: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
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
        req.userRole = 'admin';
        next();
    },
    AuthRequest: {},
}));
(0, vitest_1.describe)('Admin - Review Moderation', () => {
    let app;
    (0, vitest_1.beforeEach)(async () => {
        vitest_1.vi.clearAllMocks();
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        const { default: router } = await Promise.resolve().then(() => __importStar(require('../routes/admin')));
        app.use('/api/admin', router);
    });
    (0, vitest_1.it)('should list reviews with status filter', async () => {
        mockPrisma.review.findMany.mockResolvedValueOnce([
            { id: 1, title: 'Spam', body: 'Bad', score: 1, status: 'pending', createdAt: new Date().toISOString(), user: { id: 2, name: 'User', email: 'u@t.com' }, product: { id: 1, name: 'Game' } },
        ]);
        const res = await (0, supertest_1.default)(app)
            .get('/api/admin/reviews?status=pending')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data).toHaveLength(1);
    });
    (0, vitest_1.it)('should approve a review', async () => {
        mockPrisma.review.update.mockResolvedValueOnce({
            id: 1, status: 'approved', user: { id: 2, name: 'User' }, product: { id: 1, name: 'Game' },
        });
        const res = await (0, supertest_1.default)(app)
            .put('/api/admin/reviews/1/status')
            .send({ status: 'approved' })
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.status).toBe('approved');
    });
    (0, vitest_1.it)('should reject invalid status', async () => {
        const res = await (0, supertest_1.default)(app)
            .put('/api/admin/reviews/1/status')
            .send({ status: 'invalid' })
            .expect(400);
        (0, vitest_1.expect)(res.body.error).toContain('Invalid status');
    });
    (0, vitest_1.it)('should delete a review', async () => {
        mockPrisma.review.delete.mockResolvedValueOnce({});
        const res = await (0, supertest_1.default)(app)
            .delete('/api/admin/reviews/1')
            .expect(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
    });
});
