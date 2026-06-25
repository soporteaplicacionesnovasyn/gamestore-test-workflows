---
type: "query"
date: "2026-06-18T21:11:37.942Z"
question: "No hay validacion de stock"
contributor: "graphify"
source_nodes: ["CartItem", "OrderItem", "cart.ts", "orders.ts", "Product"]
---

# Q: No hay validacion de stock

## Answer

Missing stock validation in cart.ts (add to cart) and orders.ts (checkout) - no check against Product stock before adding items or creating orders. Also cart not cleared after checkout.

## Source Nodes

- CartItem
- OrderItem
- cart.ts
- orders.ts
- Product