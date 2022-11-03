import { Router } from 'express';
import { AuthRouter } from './auth.route';
import ConnectionRouter from './connection.route';
import RequestRouter from './request.route';

const BaseRouter = Router();

BaseRouter.use('/auth', AuthRouter);
BaseRouter.use('/request', RequestRouter);
BaseRouter.use('/connection', ConnectionRouter);

export default BaseRouter;