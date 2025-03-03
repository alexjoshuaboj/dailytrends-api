export interface IFeed {
    _id?: string;
    title: string;
    url: string;
    summary?: string;
    publishedAt: number;
    source: string;
};