import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint de prueba para validar el sistema Husky CI/CD pre-commit hook
router.get('/husky-test', (req: Request, res: Response) => {
  // Mensaje simple de validación del sistema
  // Este endpoint permite verificar que CI/CD y pre-commit están funcionando
  // sin necesidad de realizar operaciones complejas (base de datos, etc.)

  res.json({
    success: true,
    message: 'Husky CI/CD pre-commit validation test successful',
    timestamp: new Date().toISOString(),
    status: 'CI_CD_HOOK_ACTIVE'
  });
});

export default router;
