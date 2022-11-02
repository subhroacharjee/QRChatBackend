import { Router } from 'express';
import { AuthRouter } from './auth.route';
import RequestRouter from './request.route';

const BaseRouter = Router();

BaseRouter.use('/auth', AuthRouter);
BaseRouter.use('/request', RequestRouter);

export default BaseRouter;