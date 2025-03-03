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
        this._router.get('/', this.feedController.getFeeds);
        this._router.post('/', this.feedController.createFeed);
        this._router.put('/:feedId', this.feedController.updateFeed);
        this._router.delete('/:feedId', this.feedController.deleteFeed);
    }

    public get router(): Router {
        return this._router;
    }

    public set router(router: Router) {
        this._router = router;
    }
}
