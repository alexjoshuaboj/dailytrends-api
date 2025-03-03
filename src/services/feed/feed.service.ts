import { IFeedRepository } from "@interfaces/feed/IFeedRepository";
import { IFeed } from "@interfaces/feed/IFeed";

export class FeedService {
    constructor(private feedRepository: IFeedRepository) {}

    public async getFeeds(): Promise<IFeed[]> {
        return this.feedRepository.find();
    }

    public async createFeed(feed: IFeed): Promise<IFeed> {
        return this.feedRepository.create(feed);
    }

    public async deleteFeed(feedId: string): Promise<void> {
        return this.feedRepository.delete(feedId);
    }

    public async updateFeed(feedId: string, feed: IFeed): Promise<IFeed> {
        return this.feedRepository.update(feedId, feed);
    }

    public async findFeedById(feedId: string): Promise<IFeed | null> {
        return this.feedRepository.findById(feedId);
    }

    public async findAndSaveTodayFeeds(): Promise<IFeed[]> {
        return this.feedRepository.findAndSaveTodayFeeds();
    }

    public async createManyFeeds(feeds: IFeed[]): Promise<IFeed[]> {
        return this.feedRepository.createMany(feeds);
    }
}