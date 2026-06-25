## Why

El proyecto necesita una pipeline de CI/CD para validar automáticamente los cambios de OpenSpec en cada PR y push, asegurando que las especificaciones y cambios siempre sean válidos antes de mergear.

## What Changes

- Workflow de GitHub Actions para validar OpenSpec en PR y push a `main`
- Script de validación `scripts/validate-openspec.sh` con salida JSON
- Variables de entorno para CI (`NO_COLOR`, `CI=true`)

## Capabilities

### New Capabilities
- `ci-pipeline`: Automatización de validación OpenSpec en GitHub Actions

## Impact

- **Infra**: Nuevo `.github/workflows/openspec-validate.yml`
- **Scripts**: Nuevo `scripts/validate-openspec.sh`
- **Dependencias**: `jq` requerido en el runner
- **Complejidad**: Baja — configuración estándar de CI
