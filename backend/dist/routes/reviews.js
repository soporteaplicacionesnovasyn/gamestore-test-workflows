"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)({ mergeParams: true });
const prisma = new client_1.PrismaClient();
router.post('/:id/reviews', auth_1.authenticate, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId;
        const { title, body, score } = req.body;
        if (!title || typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 100) {
            return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (!body || typeof body !== 'string' || body.trim().length < 1 || body.trim().length > 2000) {
            return res.status(400).json({ error: 'Body must be between 1 and 2000 characters' });
        }
        if (!score || !Number.isInteger(score) || score < 1 || score > 5) {
            return res.status(400).json({ error: 'Score must be an integer between 1 and 5' });
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
        const review = await prisma.review.create({
            data: {
                userId,
                productId,
                title: title.trim(),
                body: body.trim(),
                score,
                status: 'pending',
            },
            include: { user: { select: { id: true, name: true } } },
        });
        res.status(201).json({ success: true, data: review });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/:id/reviews', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const where = { productId, status: 'approved' };
        const [reviews, total, aggregate] = await Promise.all([
            prisma.review.findMany({
                where,
                include: { user: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.review.count({ where }),
            prisma.rating.aggregate({
                where: { productId },
                _avg: { score: true },
                _count: { score: true },
            }),
        ]);
        res.json({
            success: true,
            data: {
                reviews,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                averageRating: aggregate._avg.score ?? 0,
                totalRatings: aggregate._count.score,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.put('/:id/reviews/:reviewId', auth_1.authenticate, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const reviewId = parseInt(req.params.reviewId);
        const userId = req.userId;
        const { title, body, score } = req.body;
        const existing = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!existing || existing.productId !== productId) {
            return res.status(404).json({ error: 'Review not found' });
        }
        if (existing.userId !== userId) {
            return res.status(403).json({ error: 'You can only edit your own reviews' });
        }
        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 100) {
                return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
            }
        }
        if (body !== undefined) {
            if (typeof body !== 'string' || body.trim().length < 1 || body.trim().length > 2000) {
                return res.status(400).json({ error: 'Body must be between 1 and 2000 characters' });
            }
        }
        if (score !== undefined) {
            if (!Number.isInteger(score) || score < 1 || score > 5) {
                return res.status(400).json({ error: 'Score must be an integer between 1 and 5' });
            }
        }
        if (score !== undefined) {
            await prisma.rating.upsert({
                where: { userId_productId: { userId, productId } },
                update: { score },
                create: { userId, productId, score },
            });
        }
        const updateData = {};
        if (title !== undefined)
            updateData.title = title.trim();
        if (body !== undefined)
            updateData.body = body.trim();
        if (score !== undefined)
            updateData.score = score;
        const review = await prisma.review.update({
            where: { id: reviewId },
            data: { ...updateData, status: 'pending' },
            include: { user: { select: { id: true, name: true } } },
        });
        res.json({ success: true, data: review });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.delete('/:id/reviews/:reviewId', auth_1.authenticate, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const reviewId = parseInt(req.params.reviewId);
        const userId = req.userId;
        const existing = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!existing || existing.productId !== productId) {
            return res.status(404).json({ error: 'Review not found' });
        }
        if (existing.userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own reviews' });
        }
        await prisma.review.delete({ where: { id: reviewId } });
        res.json({ success: true, message: 'Review deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.default = router;
