import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.userId }
      });
    }

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.userId;

    let cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
    }

    // BUG: Duplicate items get summed instead of incrementing quantity
    // FIXME: Should check if item exists and increment quantity
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });

    if (existingItem) {
      // BUG: Adding as new item instead of updating quantity
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity // BUG: Should be existingItem.quantity + quantity
        }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });
    }

    // BUG: No stock validation before adding to cart
    // TODO: Validate stock before adding

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    res.json(updatedCart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/item/:itemId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await prisma.cartItem.update({
      where: { id: parseInt(itemId) },
      data: { quantity }
    });

    // BUG: Total price not recalculated when quantity changes
    // TODO: Recalculate cart total

    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/item/:itemId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.params;

    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) }
    });

    res.json({ message: 'Item removed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/clear', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;