export interface IScraperConfig {
    url: string;
    sourceName: string;
    articleSelector: string;
    titleSelector: string;
    linkSelector: string;
    summarySelector: string;
    sliceCount?: number;
}
