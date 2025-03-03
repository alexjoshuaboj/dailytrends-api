import { IFeed } from '@interfaces/feed/IFeed';
import { IFeedRepository } from '@interfaces/feed/IFeedRepository';
import FeedModel from '@models/feed';

import dayjs from 'dayjs';

export class FeedRepository implements IFeedRepository {
    async find(): Promise<IFeed[]> {
        return FeedModel.find({}, {_id: 1, title: 1, url: 1, summary: 1, publishedAt: 1, source: 1}, { lean: true });
    }

    async create(feed: IFeed): Promise<IFeed> {
        return FeedModel.create(feed);
    }

    async delete(feedId: string): Promise<void> {
        await FeedModel.deleteOne({ _id: feedId }, { lean: true });
    }

    async update(feedId: string, feed: IFeed): Promise<IFeed> {
        return FeedModel.findByIdAndUpdate(feedId, feed, { new: true, lean: true });
    }

    async findById(feedId: string): Promise<IFeed | null> {
        return FeedModel.findById(feedId, { lean: true });
    }

    async findAndSaveTodayFeeds(): Promise<IFeed[]> {
        const startOfDayUnix = dayjs().startOf('day').unix();
        const endOfDayUnix = dayjs().endOf('day').unix();

        const feedsQuery = {
            publishedAt: {
                $gte: startOfDayUnix,
                $lte: endOfDayUnix
            }
        };

        const feeds = await FeedModel.find(
                feedsQuery, 
                {
                    _id: 1, 
                    title: 1, 
                    url: 1, 
                    summary: 1, 
                    publishedAt: 1, 
                    source: 1
                }, 
                { 
                    lean: true 
                }
            )
        .sort({ publishedAt: 'desc' });

        if (!feeds.length) {
            /* scrap */
        }

        return feeds;
    }

    async createMany(feeds: IFeed[]): Promise<IFeed[]> {
        return FeedModel.create(feeds);
    }
}