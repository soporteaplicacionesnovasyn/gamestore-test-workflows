import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });

    // Extract distinct categories and sort alphabetically
    const categoryList = categories
      .map(item => item.category)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      data: categoryList
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = '1', limit = '10', category, minPrice, maxPrice, sort, search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // BUG: No caching - every request fetches all products
    // TODO: Implement caching layer

    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (minPrice) {
      const minPriceNum = parseFloat(minPrice as string);
      if (!isNaN(minPriceNum)) {
        where.price = { ...where.price, gte: minPriceNum };
      }
    }
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice as string);
      if (!isNaN(maxPriceNum)) {
        where.price = { ...where.price, lte: maxPriceNum };
      }
    }

    if (search) {
      where.name = { contains: (search as string).trim() };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;