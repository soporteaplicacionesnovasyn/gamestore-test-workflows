import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockPrisma = {
  product: {
    findUnique: vi.fn(),
  },
  rating: {
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

vi.mock('../middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.userId = 1;
    req.userRole = 'user';
    next();
  },
  AuthRequest: {} as any,
}));

describe('Products - Rating', () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    const { default: router } = await import('../routes/ratings');
    app.use('/api/products', router);
  });

  it('should rate a product successfully', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
    mockPrisma.rating.upsert.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, score: 4 });
    mockPrisma.rating.aggregate.mockResolvedValueOnce({ _avg: { score: 4 }, _count: { score: 1 } });

    const res = await request(app)
      .post('/api/products/1/rate')
      .send({ score: 4 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.averageRating).toBe(4);
    expect(res.body.data.totalRatings).toBe(1);
  });

  it('should update an existing rating', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
    mockPrisma.rating.upsert.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, score: 2 });
    mockPrisma.rating.aggregate.mockResolvedValueOnce({ _avg: { score: 2 }, _count: { score: 1 } });

    const res = await request(app)
      .post('/api/products/1/rate')
      .send({ score: 2 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(mockPrisma.rating.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_productId: { userId: 1, productId: 1 } },
        update: { score: 2 },
        create: { userId: 1, productId: 1, score: 2 },
      })
    );
  });

  it('should reject invalid score', async () => {
    const res = await request(app)
      .post('/api/products/1/rate')
      .send({ score: 6 })
      .expect(400);

    expect(res.body.error).toBe('Score must be between 1 and 5');
  });

  it('should return 404 for nonexistent product', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/products/999/rate')
      .send({ score: 3 })
      .expect(404);

    expect(res.body.error).toBe('Product not found');
  });
});


