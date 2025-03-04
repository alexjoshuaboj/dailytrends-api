import { load } from 'cheerio';
import axios from 'axios';
import dayjs from 'dayjs';

import { IFeed } from '@interfaces/feed/IFeed';
import { IScraperConfig } from '@interfaces/scraper/IScraperConfig';

export class AbstractScraper {
    private config: IScraperConfig;

    constructor(config: IScraperConfig) {
        this.config = config;
    }

    private async fetchHtml(): Promise<string> {
        const res = await axios.get(this.config.url);
        return res.data;
    }

    public async scrapeData(): Promise<IFeed[]> {
        const html = await this.fetchHtml();
        const $ = load(html);

        const feeds: IFeed[] = [];

        $(this.config.articleSelector)
            .slice(0, this.config.sliceCount ?? 5)
            .each((_ , ele) => {
                const title = $(ele).find(this.config.titleSelector).text().trim();
                const url = $(ele).find(this.config.linkSelector).attr('href') ?? '';

                const summary = this.config.summarySelector ? 
                    $(ele).find(this.config.summarySelector).text().trim() : '';
                    
                const publishedAt = dayjs().unix();

                const source = this.config.sourceName;

                const article: IFeed = {
                    title,
                    url,
                    summary,
                    publishedAt,
                    source
                }

                feeds.push(article);
            });
        
        return feeds;
    }
}