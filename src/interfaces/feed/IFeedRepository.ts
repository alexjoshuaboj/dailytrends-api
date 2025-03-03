import { IFeed } from '@interfaces/feed/IFeed';

export interface IFeedRepository {
    find(): Promise<IFeed[]>;
};