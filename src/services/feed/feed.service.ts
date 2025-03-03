import { IFeedRepository } from "@interfaces/feed/IFeedRepository";
import { IFeed } from "@interfaces/feed/IFeed";

export class FeedService {
    constructor(private feedRepository: IFeedRepository) {}

    public async getFeeds(): Promise<IFeed[]> {
        return this.feedRepository.find();
    }
}