import { IFeed } from '@interfaces/feed/IFeed';

export interface IFeedRepository {
    find(): Promise<IFeed[]>;
    create(feed: IFeed): Promise<IFeed>;
    delete(feedId: string): Promise<void>;
    update(feedId: string, feed: IFeed): Promise<IFeed>;
    findById(feedId: string): Promise<IFeed | null>;
    findAndSaveTodayFeeds(): Promise<IFeed[]>;
    createMany(feeds: IFeed[]): Promise<IFeed[]>;
};