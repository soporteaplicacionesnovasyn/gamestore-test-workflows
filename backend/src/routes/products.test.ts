import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockPrisma = {
  product: {
    findMany: vi.fn(),
    count: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  rating: {
    groupBy: vi.fn(),
    upsert: vi.fn(),
    aggregate: vi.fn(),
    findMany: vi.fn(),
  },
};

vi.mock('@prisma/client', () => ({
  PrismaClient: function () {
    return mockPrisma;
  },
}));

describe('Products - Search', () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockPrisma.rating.groupBy.mockResolvedValue([]);
    app = express();
    app.use(express.json());
    const { default: router } = await import('../routes/products');
    app.use('/api/products', router);
  });

  it('should filter products by name using contains', async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      { id: 1, name: 'Adventure Quest', price: 29.99, category: 'Adventure' },
    ]);
    mockPrisma.product.count.mockResolvedValueOnce(1);

    const res = await request(app)
      .get('/api/products?search=adv')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toHaveLength(1);
    expect(res.body.data.products[0].name).toBe('Adventure Quest');
  });

  it('should return empty list when search matches nothing', async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([]);
    mockPrisma.product.count.mockResolvedValueOnce(0);

    const res = await request(app)
      .get('/api/products?search=zzznotfound')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toHaveLength(0);
    expect(res.body.data.total).toBe(0);
  });

  it('should return all products when search is empty', async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      { id: 1, name: 'Game A', price: 19.99, category: 'Action' },
      { id: 2, name: 'Game B', price: 29.99, category: 'RPG' },
    ]);
    mockPrisma.product.count.mockResolvedValueOnce(2);

    const res = await request(app)
      .get('/api/products')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toHaveLength(2);
    expect(res.body.data.total).toBe(2);
  });

  it('should combine search with category filter', async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      { id: 3, name: 'Adventure World', price: 39.99, category: 'Adventure' },
    ]);
    mockPrisma.product.count.mockResolvedValueOnce(1);

    const res = await request(app)
      .get('/api/products?search=adventure&category=Adventure')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toHaveLength(1);

    const whereArg = mockPrisma.product.findMany.mock.calls[0][0].where;
    expect(whereArg.name).toBeDefined();
    expect(whereArg.category).toBe('Adventure');
  });

  it('should be case-insensitive', async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      { id: 4, name: 'Adventure Quest', price: 29.99, category: 'Adventure' },
    ]);
    mockPrisma.product.count.mockResolvedValueOnce(1);

    const resUppercase = await request(app)
      .get('/api/products?search=ADVENTURE')
      .expect(200);

    expect(resUppercase.body.success).toBe(true);
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          name: expect.objectContaining({ contains: 'ADVENTURE' }),
        }),
      })
    );
  });

  it('should trim whitespace from search input', async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([]);
    mockPrisma.product.count.mockResolvedValueOnce(0);

    await request(app)
      .get('/api/products?search=  zelda  ')
      .expect(200);

    const whereArg = mockPrisma.product.findMany.mock.calls[0][0].where;
    expect(whereArg.name.contains).toBe('zelda');
  });

  it('should return success false on server error', async () => {
    mockPrisma.product.findMany.mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app)
      .get('/api/products?search=test')
      .expect(500);

    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });
});
