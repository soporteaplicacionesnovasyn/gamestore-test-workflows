"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)({ mergeParams: true });
const prisma = new client_1.PrismaClient();
router.post('/:id/rate', auth_1.authenticate, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { score } = req.body;
        const userId = req.userId;
        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ error: 'Score must be between 1 and 5' });
        }
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await prisma.rating.upsert({
            where: { userId_productId: { userId, productId } },
            update: { score },
            create: { userId, productId, score },
        });
        const aggregate = await prisma.rating.aggregate({
            where: { productId },
            _avg: { score: true },
            _count: { score: true },
        });
        res.json({
            success: true,
            data: {
                averageRating: aggregate._avg.score ?? 0,
                totalRatings: aggregate._count.score,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/:id/ratings', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const ratings = await prisma.rating.findMany({
            where: { productId },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        const aggregate = await prisma.rating.aggregate({
            where: { productId },
            _avg: { score: true },
            _count: { score: true },
        });
        res.json({
            success: true,
            data: {
                ratings,
                averageRating: aggregate._avg.score ?? 0,
                totalRatings: aggregate._count.score,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
