import { IFeed } from '@interfaces/feed/IFeed';
import { IFeedRepository } from '@interfaces/feed/IFeedRepository';
import FeedModel from '@models/feed';

export class FeedRepository implements IFeedRepository {
    async find(): Promise<IFeed[]> {
        return FeedModel.find();
    }
}