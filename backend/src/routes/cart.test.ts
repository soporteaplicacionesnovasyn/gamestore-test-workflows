import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

vi.mock('../middleware/auth', () => ({
  authenticate: vi.fn((req, _res, next) => {
    req.userId = 1;
    next();
  }),
  AuthRequest: {},
}));

const mockPrisma = {
  product: { findUnique: vi.fn(), update: vi.fn() },
  cart: { findUnique: vi.fn(), create: vi.fn() },
  cartItem: { findFirst: vi.fn(), update: vi.fn(), create: vi.fn(), deleteMany: vi.fn() },
  $transaction: vi.fn(cb => cb(mockPrisma)),
};

vi.mock('@prisma/client', () => ({
  PrismaClient: function() { return mockPrisma; },
}));

describe('Cart - Stock Validation', () => {
  let app;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    const { default: router } = await import('../routes/cart');
    app.use('/api/cart', router);
  });

  it('should add item when quantity <= stock', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 10, stock: 5 });
    mockPrisma.cartItem.findFirst.mockResolvedValueOnce(null);
    mockPrisma.cartItem.create.mockResolvedValueOnce({ id: 1, cartId: 1, productId: 10, quantity: 3 });
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, items: [{ id: 1, productId: 10, quantity: 3, product: { id: 10, name: 'Game', stock: 5 } }] });

    const res = await request(app).post('/api/cart/add').send({ productId: 10, quantity: 3 }).expect(200);
    expect(res.body).toBeDefined();
  });

  it('should reject when quantity > stock', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 10, stock: 2 });
    mockPrisma.cartItem.findFirst.mockResolvedValueOnce(null);

    const res = await request(app).post('/api/cart/add').send({ productId: 10, quantity: 5 }).expect(400);
    expect(res.body).toEqual({ error: 'Insufficient stock', productId: 10, available: 2 });
  });

  it('should reject when product not found', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockPrisma.product.findUnique.mockResolvedValueOnce(null);

    const res = await request(app).post('/api/cart/add').send({ productId: 999, quantity: 1 }).expect(400);
    expect(res.body).toEqual({ error: 'Product not found' });
  });

  it('should reject when total qty > stock (existing + new)', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1 });
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 10, stock: 5 });
    mockPrisma.cartItem.findFirst.mockResolvedValueOnce({ id: 1, cartId: 1, productId: 10, quantity: 4 });

    const res = await request(app).post('/api/cart/add').send({ productId: 10, quantity: 2 }).expect(400);
    expect(res.body).toEqual({ error: 'Insufficient stock', productId: 10, available: 5 });
  });
});
