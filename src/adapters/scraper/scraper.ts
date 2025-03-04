import { IFeed } from '@interfaces/feed/IFeed';
import { AbstractScraper } from './abstractScraper';

export class ScraperService {
    public static async scrapeAll(): Promise<IFeed[]> {
        const elPaisFeeds = new AbstractScraper({
            url: 'https://elpais.com/',
            sourceName: 'El País',
            articleSelector: 'article',
            titleSelector: 'h2',
            linkSelector: 'a',
            summarySelector: 'p',
            sliceCount: 5
        });

        const elMundoFeeds = new AbstractScraper({
            url: 'https://www.elmundo.es/',
            sourceName: 'El Mundo',
            articleSelector: 'article.ue-c-cover-content',
            titleSelector: 'h2.ue-c-cover-content__headline',
            linkSelector: 'a.ue-c-cover-content__link',
            summarySelector: 'p.ue-c-cover-content__description',
            sliceCount: 5
        }); 

        const elPaisFeedsData = await elPaisFeeds.scrapeData();
        const elMundoFeedsData = await elMundoFeeds.scrapeData();

        return [...elPaisFeedsData, ...elMundoFeedsData];
    }
}