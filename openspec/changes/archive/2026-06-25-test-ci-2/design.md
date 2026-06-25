## Context

Actualmente no hay validación automática de especificaciones OpenSpec. Los cambios pueden ser mergeados con errores en los specs, causando inconsistencias.

## Goals / Non-Goals

**Goals:**
- Validar OpenSpec en cada PR que modifique `openspec/**`
- Proveer script local de validación con `--json`
- Reportar errores claramente en CI

**Non-Goals:**
- Despliegue automático
- Testing de integración
- Linting de código

## Decisions

| Decisión | Alternativas | Por qué |
|----------|-------------|--------|
| GitHub Actions | Jenkins, CircleCI | Ya en el ecosistema GitHub, sin costo para repos públicos |
| Script en bash | Node.js script | Mínimo overhead, `jq` disponible en runners de GitHub |
| Validación en PR + push a main | Solo en PR | Atrapar errores temprano y asegurar main limpio |

## Files Affected

| File | Type |
|------|------|
| `.github/workflows/openspec-validate.yml` | New |
| `scripts/validate-openspec.sh` | New |
