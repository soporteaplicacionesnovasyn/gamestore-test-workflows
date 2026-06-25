"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', async (req, res) => {
    try {
        const { page = '1', limit = '10', category, minPrice, maxPrice, sort, search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // BUG: No caching - every request fetches all products
        // TODO: Implement caching layer
        const where = {};
        if (category) {
            where.category = category;
        }
        if (minPrice) {
            where.price = { ...where.price, gte: parseFloat(minPrice) };
        }
        if (maxPrice) {
            where.price = { ...where.price, lte: parseFloat(maxPrice) };
        }
        if (search) {
            where.name = { contains: search.trim() };
        }
        let orderBy = { createdAt: 'desc' };
        if (sort === 'price_asc') {
            orderBy = { price: 'asc' };
        }
        else if (sort === 'price_desc') {
            orderBy = { price: 'desc' };
        }
        // BUG: N+1 query problem - fetches each product separately
        const products = await prisma.product.findMany({
            where,
            skip,
            take: limitNum,
            orderBy
        });
        const total = await prisma.product.count({ where });
        const productIds = products.map(p => p.id);
        const ratingsAgg = await prisma.rating.groupBy({
            by: ['productId'],
            where: { productId: { in: productIds } },
            _avg: { score: true },
            _count: { score: true },
        });
        const ratingMap = new Map(ratingsAgg.map(r => [r.productId, {
                averageRating: r._avg.score ?? 0,
                totalRatings: r._count.score,
            }]));
        const productsWithRating = products.map(p => ({
            ...p,
            averageRating: ratingMap.get(p.id)?.averageRating ?? 0,
            totalRatings: ratingMap.get(p.id)?.totalRatings ?? 0,
        }));
        res.json({
            success: true,
            data: {
                products: productsWithRating,
                total,
                page: pageNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { name, description, price, image, stock, category } = req.body;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image, // BUG: Absolute path pointing to localhost
                stock,
                category
            }
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, stock, category } = req.body;
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                stock,
                category
            }
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
