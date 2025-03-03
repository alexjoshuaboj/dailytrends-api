import { Router } from 'express';
import { FeedController } from '@controllers/feed.controller';

export default class FeedRoutes {
    private _router: Router;
    private feedController: FeedController;

    constructor() {
        this._router = Router();
        this.feedController = new FeedController();
        this.configureRoutes();
    }

    private configureRoutes(): void {
        this._router.get('/', (_, res) => {
            res.send({
                message: 'Feed route'
            });
        });
    }

    public get router(): Router {
        return this._router;
    }

    public set router(router: Router) {
        this._router = router;
    }
}
