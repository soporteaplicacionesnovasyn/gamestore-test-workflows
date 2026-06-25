import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router({ mergeParams: true });
const prisma = new PrismaClient();

router.post('/:id/rate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const productId = parseInt(req.params.id);
    const { score } = req.body;
    const userId = req.userId!;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be between 1 and 5' });
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

    const aggregate = await prisma.rating.aggregate({
      where: { productId },
      _avg: { score: true },
      _count: { score: true },
    });

    res.json({
      success: true,
      data: {
        averageRating: aggregate._avg.score ?? 0,
        totalRatings: aggregate._count.score,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id/ratings', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const ratings = await prisma.rating.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const aggregate = await prisma.rating.aggregate({
      where: { productId },
      _avg: { score: true },
      _count: { score: true },
    });

    res.json({
      success: true,
      data: {
        ratings,
        averageRating: aggregate._avg.score ?? 0,
        totalRatings: aggregate._count.score,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
