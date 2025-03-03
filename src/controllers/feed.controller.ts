import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IFeed } from '@interfaces/feed/IFeed';
import { FeedRepository } from '@repositories/feed.repository';
import { FeedService } from '@services/feed/feed.service'; 

import dayjs from 'dayjs';

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

    public createFeed = async (req: Request, res: Response): Promise<void> => {
        const { body } = req;
        
        try {
            const feed: IFeed = body;
            feed.publishedAt = dayjs().unix();

            const createdFeed = await this.feedRepository.create(feed);

            res.status(StatusCodes.CREATED).json(createdFeed);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public deleteFeed = async (req: Request, res: Response): Promise<void> => {
        const { params: { feedId } } = req;

        try {
            await this.feedRepository.delete(feedId);

            res.status(StatusCodes.OK).json({
                message: 'Feed deleted successfully'
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    public updateFeed = async (req: Request, res: Response): Promise<void> => {
        const { params: { feedId }, body } = req;

        try {
            const feed: IFeed = body;
            const updatedFeed = await this.feedRepository.update(feedId, feed);

            res.status(StatusCodes.OK).json(updatedFeed);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}