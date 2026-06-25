"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/checkout', auth_1.authenticate, async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.userId;
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
        const insufficientStock = [];
        for (const item of cart.items) {
            if (item.quantity > item.product.stock) {
                insufficientStock.push({
                    productId: item.productId,
                    name: item.product.name,
                    available: item.product.stock,
                    requested: item.quantity
                });
            }
        }
        if (insufficientStock.length > 0) {
            return res.status(400).json({
                error: 'Insufficient stock',
                products: insufficientStock
            });
        }
        let total = 0;
        const orderItemsData = [];
        for (const item of cart.items) {
            const price = parseFloat(item.product.price);
            total += price * item.quantity;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price
            });
        }
        const order = await prisma.$transaction(async (tx) => {
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
            return tx.order.create({
                data: {
                    userId,
                    total,
                    status: 'pending',
                    items: {
                        create: orderItemsData
                    }
                },
                include: {
                    items: {
                        include: { product: true }
                    }
                }
            });
        });
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        // BUG: No order history for user
        // TODO: Return user order history
        const orders = await prisma.order.findMany({
            where: { userId: req.userId },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:id', auth_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findFirst({
            where: { id: parseInt(id), userId: req.userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
