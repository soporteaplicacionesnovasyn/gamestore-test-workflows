# Análisis: Búsqueda por comodín en el catálogo

## Resumen

El catálogo de productos (`GET /api/products`) actualmente solo permite filtrar por categoría (exact match), rango de precios y ordenamiento. No existe ningún tipo de búsqueda por texto libre. Se requiere agregar una funcionalidad de búsqueda por comodín (wildcard) donde al escribir las primeras letras se filtren los productos del catálogo.

## Estado actual

### Backend — `backend/src/routes/products.ts`

El `where` clause de Prisma se construye así:

```typescript
const where: any = {};

if (category) {
  where.category = category as string;
}
if (minPrice) {
  where.price = { ...where.price, gte: parseFloat(minPrice as string) };
}
if (maxPrice) {
  where.price = { ...where.price, lte: parseFloat(maxPrice as string) };
}
```

**No existe** parámetro `search`, `q` ni `name`.

### Frontend — `frontend/src/pages/Products.tsx`

Estados existentes:

| Estado     | Tipo     | Propósito                |
| ---------- | -------- | ------------------------ |
| `page`     | `number` | Paginación               |
| `category` | `string` | Filtro por categoría     |
| `sort`     | `string` | Ordenamiento             |
| `minPrice` | `string` | Precio mínimo            |
| `maxPrice` | `string` | Precio máximo            |

**No existe** estado `search` ni input de texto libre.

El `useEffect` que dispara `loadProducts()` solo depende de `[page, category, sort, minPrice, maxPrice]`.

### API Client — `frontend/src/services/api.ts`

```typescript
getAll: async (params = {}) => {
  const query = new URLSearchParams(params as any).toString();
  return fetchWithAuth(`/products?${query}`).then(r => r.json());
}
```

Acepta cualquier parámetro y lo serializa a query string — no requiere cambios.

## Plan de implementación

### 1. Backend — Agregar parámetro `search`

**Archivo:** `backend/src/routes/products.ts`

Agregar en la desestructuración de `req.query`:

```typescript
const { page = '1', limit = '10', category, minPrice, maxPrice, sort, search } = req.query;
```

Agregar al `where` clause:

```typescript
if (search) {
  where.name = { contains: search, mode: 'insensitive' };
}
```

- `contains` → SQLite genera `LIKE '%termino%'` (coincidencia parcial, comportamiento wildcard)
- `mode: 'insensitive'` → busca sin distinguir mayúsculas/minúsculas

**Alternativa:** si se quiere solo prefijo (primeras letras), usar `startsWith` en lugar de `contains`. Esto genera `LIKE 'termino%'`.

### 2. Frontend — Agregar input de búsqueda

**Archivo:** `frontend/src/pages/Products.tsx`

#### 2a. Agregar estado

```typescript
const [search, setSearch] = useState('');
```

#### 2b. Agregar input con debounce

```typescript
// Debounce: esperar 400ms después del último tipeo antes de buscar
useEffect(() => {
  const timer = setTimeout(() => {
    setPage(1);
    loadProducts();
  }, 400);
  return () => clearTimeout(timer);
}, [search]);
```

#### 2c. Incluir `search` en los params

```typescript
const params: any = { page, limit: 10 };
if (category) params.category = category;
if (sort) params.sort = sort;
if (minPrice) params.minPrice = minPrice;
if (maxPrice) params.maxPrice = maxPrice;
if (search) params.search = search;  // ← nueva línea
```

#### 2d. Agregar el input HTML

```tsx
<input
  type="text"
  placeholder="Buscar productos..."
  value={search}
  onChange={e => setSearch(e.target.value)}
  className="border p-2 rounded w-64"
/>
```

### 3. Consideraciones

| Aspecto              | Decisión                                           |
| -------------------- | -------------------------------------------------- |
| Tipo de búsqueda     | `contains` (substring) vs `startsWith` (prefijo)   |
| Case sensitivity     | `mode: 'insensitive'`                              |
| Debounce             | 300-400ms para evitar llamadas por cada tecla      |
| Búsqueda vacía       | No agregar filtro `name` → muestra todos           |
| Búsqueda + paginación| Resetear a página 1 al buscar                      |
| Búsqueda + filtros   | Todos los filtros se combinan en el `where` clause |

### 4. Archivos a modificar

- `backend/src/routes/products.ts` — ~4 líneas (desestructurar `search` + condición en `where`)
- `frontend/src/pages/Products.tsx` — ~20 líneas (estado + debounce + input + params)
- Sin cambios en `api.ts` — ya acepta parámetros dinámicos

### 5. Prueba manual

1. Iniciar backend + frontend
2. Navegar a `/products`
3. Escribir "adv" en el campo de búsqueda
4. Verificar que solo aparezcan productos cuyo nombre contenga "adv" (case insensitive)
5. Limpiar el campo → deben aparecer todos los productos nuevamente
6. Probar combinación: búsqueda + categoría + rango de precio
