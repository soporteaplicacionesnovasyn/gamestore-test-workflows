import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

const mockPrisma = {
  review: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
    req.userRole = 'admin';
    next();
  },
  AuthRequest: {} as any,
}));

describe('Admin - Review Moderation', () => {
  let app: express.Express;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    const { default: router } = await import('../routes/admin');
    app.use('/api/admin', router);
  });

  it('should list reviews with status filter', async () => {
    mockPrisma.review.findMany.mockResolvedValueOnce([
      { id: 1, title: 'Spam', body: 'Bad', score: 1, status: 'pending', createdAt: new Date().toISOString(), user: { id: 2, name: 'User', email: 'u@t.com' }, product: { id: 1, name: 'Game' } },
    ]);

    const res = await request(app)
      .get('/api/admin/reviews?status=pending')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it('should approve a review', async () => {
    mockPrisma.review.update.mockResolvedValueOnce({
      id: 1, status: 'approved', user: { id: 2, name: 'User' }, product: { id: 1, name: 'Game' },
    });

    const res = await request(app)
      .put('/api/admin/reviews/1/status')
      .send({ status: 'approved' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('approved');
  });

  it('should reject invalid status', async () => {
    const res = await request(app)
      .put('/api/admin/reviews/1/status')
      .send({ status: 'invalid' })
      .expect(400);

    expect(res.body.error).toContain('Invalid status');
  });

  it('should delete a review', async () => {
    mockPrisma.review.delete.mockResolvedValueOnce({});

    const res = await request(app)
      .delete('/api/admin/reviews/1')
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});
