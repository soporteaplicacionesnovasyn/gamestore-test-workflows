"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        // BUG: Password stored in plain text
        const user = await prisma.user.create({
            data: {
                email,
                password, // TODO: Store hashed password
                name,
                role: 'user'
            }
        });
        const token = (0, auth_1.generateToken)(user.id, user.role);
        const refreshToken = (0, auth_1.generateRefreshToken)(user.id);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        res.json({ token, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // BUG: Comparing plain text passwords directly
        const user = await prisma.user.findFirst({
            where: { email, password } // FIXME: Should compare with hashed password
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        const refreshToken = (0, auth_1.generateRefreshToken)(user.id);
        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        res.json({ token, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
        }
        const decoded = (0, auth_1.verifyRefreshToken)(refreshToken);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        // BUG: Refresh token is not renewed, returning the same token
        const token = (0, auth_1.generateToken)(user.id, user.role);
        // FIXME: Should generate new refresh token and store it
        res.json({ token, refreshToken }); // BUG: Returning same refresh token instead of new one
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/logout', auth_1.authenticate, async (req, res) => {
    try {
        await prisma.user.update({
            where: { id: req.userId },
            data: { refreshToken: null }
        });
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/me', auth_1.authenticate, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, email: true, name: true, role: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
