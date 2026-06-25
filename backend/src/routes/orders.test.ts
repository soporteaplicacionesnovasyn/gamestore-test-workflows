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
  order: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() },
  $transaction: vi.fn(cb => cb(mockPrisma)),
};

vi.mock('@prisma/client', () => ({
  PrismaClient: function() { return mockPrisma; },
}));

describe('Orders - Stock Validation', () => {
  let app;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    const { default: router } = await import('../routes/orders');
    app.use('/api/orders', router);
  });

  it('should succeed when stock is sufficient', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [{ id: 1, productId: 10, quantity: 2, product: { id: 10, name: 'Game', price: '29.99', stock: 10 } }] });
    mockPrisma.product.update.mockResolvedValueOnce({ id: 10, stock: 8 });
    mockPrisma.cartItem.deleteMany.mockResolvedValueOnce({ count: 1 });
    mockPrisma.order.create.mockResolvedValueOnce({ id: 1, userId: 1, total: 59.98, status: 'pending', items: [{ id: 1, productId: 10, quantity: 2, price: 29.99 }] });

    const res = await request(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(201);
    expect(res.body.status).toBe('pending');
    expect(mockPrisma.product.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { stock: { decrement: 2 } } });
    expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({ where: { cartId: 1 } });
    expect(mockPrisma.\).toHaveBeenCalled();
  });

  it('should reject when stock is insufficient', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [{ id: 1, productId: 10, quantity: 15, product: { id: 10, name: 'Game', price: '29.99', stock: 10 } }] });

    const res = await request(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(400);
    expect(res.body).toEqual({ error: 'Insufficient stock', products: [{ productId: 10, name: 'Game', available: 10, requested: 15 }] });
    expect(mockPrisma.\).not.toHaveBeenCalled();
  });

  it('should reject when cart is empty', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [] });

    const res = await request(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(400);
    expect(res.body).toEqual({ error: 'Cart is empty' });
  });

  it('should handle multiple items with one insufficient', async () => {
    mockPrisma.cart.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, items: [
      { id: 1, productId: 10, quantity: 2, product: { id: 10, name: 'Game A', price: '29.99', stock: 10 } },
      { id: 2, productId: 11, quantity: 20, product: { id: 11, name: 'Game B', price: '19.99', stock: 5 } },
    ] });

    const res = await request(app).post('/api/orders/checkout').send({ shippingAddress: 'Test', paymentMethod: 'card' }).expect(400);
    expect(res.body.error).toBe('Insufficient stock');
    expect(res.body.products).toHaveLength(1);
    expect(res.body.products[0].productId).toBe(11);
  });
});
