## Why

El catálogo de productos actual tiene bugs conocidos de rendimiento (N+1 query, sin caché) y carece de funcionalidades como búsqueda avanzada, validación de entrada y productos relacionados. Este cambio aborda todas estas mejoras para optimizar la experiencia de navegación y la robustez del backend.

## What Changes

- **advanced-search**: Búsqueda de texto completo por nombre, descripción y categoría
- **cache-system**: Capa de caché en memoria para `GET /api/products` y `GET /api/products/:id`
- **input-validation**: Validación de parámetros de query (page, limit, price range) con mensajes de error claros
- **related-products**: Endpoint `GET /api/products/:id/related` que retorna productos de la misma categoría

## Capabilities

### New Capabilities
- `advanced-search`: Búsqueda de productos por coincidencia parcial en nombre, descripción y categoría
- `cache-system`: Caché en memoria con TTL para endpoints de productos
- `input-validation`: Validación de parámetros con errores descriptivos
- `related-products`: Productos relacionados basados en categoría compartida

### Modified Capabilities
- `catalog`: El endpoint `GET /api/products` se beneficia de caché y validación mejorada

## Impact

- **Backend**: Modificaciones en `backend/src/routes/products.ts`, nuevos archivos para caché y validación
- **Frontend**: Actualización de `api.ts` con nuevos métodos de búsqueda y relacionados
- **Dependencias**: Ninguna nueva — caché en memoria con `Map` nativo
- **Complejidad**: Media — cambios distribuidos en varios archivos pero cada uno es simple
