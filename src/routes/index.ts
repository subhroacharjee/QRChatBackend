import { Router } from 'express';
import { AuthRouter } from './auth.route';

const BaseRouter = Router();

BaseRouter.use('/auth', AuthRouter);

export default BaseRouter;