const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.get('/test', async (req, res) => {
  const { search } = req.query;
  console.log('search param:', search);
  const where = search ? { name: { contains: search } } : {};
  const products = await prisma.product.findMany({ where, take: 5 });
  res.json({ products: products.map(p => p.name), where });
});

app.listen(3002, () => console.log('Test server on 3002'));
