import { Router } from 'express';
import { adminLoginController } from '../controllers/authController';
import { validateSchemaMiddleware } from '../utils/validation';
import { adminLoginSchema } from '../validators/auth';

const router = Router();

// Admin login (hardcoded)
router.post('/login', validateSchemaMiddleware(adminLoginSchema), adminLoginController);

export default router;
