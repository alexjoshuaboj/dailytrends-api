import { ScraperService } from "@adapters/scraper/scraper";
import { AbstractScraper } from "@adapters/scraper/abstractScraper";
import { IFeed } from "@interfaces/feed/IFeed";

describe('Scraper Service', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return combined news of El País and El Mundo', async () => {
        const elPaisMockFeeds: IFeed[] = [
            {
                title: 'El País Article 1',
                url: 'https://elpais.com/article1',
                publishedAt: 1741048999313,
                source: 'El País',
            }
        ];

        const elMundoMockFeeds: IFeed[] = [
            {
                title: 'El Mundo Article 1',
                url: 'https://elmundo.es/article1',
                publishedAt: 1741048999313,
                source: 'El Mundo',
            }
        ]

        const getScraperDataSpy = jest
            .spyOn(AbstractScraper.prototype, 'scrapeData')
            .mockImplementationOnce(() => Promise.resolve(elPaisMockFeeds))
            .mockImplementationOnce(() => Promise.resolve(elMundoMockFeeds))
            
        const res = await ScraperService.scrapeAll();

        expect(getScraperDataSpy).toHaveBeenCalledTimes(2);
        expect(res).toEqual(expect.arrayContaining([...elMundoMockFeeds, ...elPaisMockFeeds]));

    });
});