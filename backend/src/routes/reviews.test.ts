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
  },
  review: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
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

describe('Reviews - CRUD', () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    const { default: router } = await import('../routes/reviews');
    app.use('/api/products', router);
  });

  it('should create a review successfully', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
    mockPrisma.rating.upsert.mockResolvedValueOnce({});
    mockPrisma.review.create.mockResolvedValueOnce({
      id: 1,
      userId: 1,
      productId: 1,
      title: 'Great game',
      body: 'Really enjoyed it',
      score: 5,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { id: 1, name: 'Test User' },
    });

    const res = await request(app)
      .post('/api/products/1/reviews')
      .send({ title: 'Great game', body: 'Really enjoyed it', score: 5 })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Great game');
    expect(res.body.data.status).toBe('pending');
  });

  it('should reject review with invalid score', async () => {
    const res = await request(app)
      .post('/api/products/1/reviews')
      .send({ title: 'Great game', body: 'Really enjoyed it', score: 6 })
      .expect(400);

    expect(res.body.error).toBe('Score must be an integer between 1 and 5');
  });

  it('should reject review with empty title', async () => {
    const res = await request(app)
      .post('/api/products/1/reviews')
      .send({ title: '', body: 'Really enjoyed it', score: 4 })
      .expect(400);

    expect(res.body.error).toBe('Title must be between 1 and 100 characters');
  });

  it('should reject review with missing body', async () => {
    const res = await request(app)
      .post('/api/products/1/reviews')
      .send({ title: 'Great game', score: 4 })
      .expect(400);

    expect(res.body.error).toBe('Body must be between 1 and 2000 characters');
  });

  it('should return 404 for nonexistent product', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/api/products/999/reviews')
      .send({ title: 'Great game', body: 'Really enjoyed it', score: 4 })
      .expect(404);

    expect(res.body.error).toBe('Product not found');
  });

  it('should get paginated reviews', async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({ id: 1, name: 'Test Game' });
    mockPrisma.review.findMany.mockResolvedValueOnce([
      { id: 1, title: 'Great', body: 'Nice', score: 5, status: 'approved', createdAt: new Date().toISOString(), user: { id: 1, name: 'User' } },
    ]);
    mockPrisma.review.count.mockResolvedValueOnce(1);
    mockPrisma.rating.aggregate.mockResolvedValueOnce({ _avg: { score: 5 }, _count: { score: 1 } });

    const res = await request(app)
      .get('/api/products/1/reviews?page=1&limit=10')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.reviews).toHaveLength(1);
    expect(res.body.data.total).toBe(1);
  });

  it('should update own review', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1, title: 'Old', body: 'Old body', score: 3 });
    mockPrisma.rating.upsert.mockResolvedValueOnce({});
    mockPrisma.review.update.mockResolvedValueOnce({
      id: 1, userId: 1, productId: 1, title: 'Updated', body: 'Updated body', score: 4, status: 'pending',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      user: { id: 1, name: 'Test User' },
    });

    const res = await request(app)
      .put('/api/products/1/reviews/1')
      .send({ title: 'Updated', body: 'Updated body', score: 4 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Updated');
  });

  it('should reject update of another user review', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({ id: 1, userId: 2, productId: 1 });

    const res = await request(app)
      .put('/api/products/1/reviews/1')
      .send({ title: 'Updated' })
      .expect(403);

    expect(res.body.error).toBe('You can only edit your own reviews');
  });

  it('should delete own review', async () => {
    mockPrisma.review.findUnique.mockResolvedValueOnce({ id: 1, userId: 1, productId: 1 });
    mockPrisma.review.delete.mockResolvedValueOnce({});

    const res = await request(app)
      .delete('/api/products/1/reviews/1')
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});
