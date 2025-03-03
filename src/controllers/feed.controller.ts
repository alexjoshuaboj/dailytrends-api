import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IFeed } from '@interfaces/feed/IFeed';
import { FeedRepository } from '@repositories/feed.repository';
import { FeedService } from '@services/feed/feed.service'; 

export class FeedController {
    private feedRepository: FeedRepository = new FeedRepository();
    private feedService: FeedService = new FeedService(this.feedRepository);
    
    public getFeeds = async (_: Request, res: Response): Promise<void> => {
        try {
            const feeds: IFeed[] = await this.feedService.getFeeds();
            res.status(StatusCodes.OK).json(feeds);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}