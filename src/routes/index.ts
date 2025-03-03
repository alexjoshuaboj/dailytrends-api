import { Router } from 'express';
import feedRoutes from './feed';

const routes = Router();
const feedRouter = new feedRoutes();

routes.use('/feeds', feedRouter.router);

export default routes;