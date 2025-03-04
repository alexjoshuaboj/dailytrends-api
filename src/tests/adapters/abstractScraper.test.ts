import { AbstractScraper } from "@adapters/scraper/abstractScraper";
import axios from 'axios';

jest.mock('axios');

describe('Abstract Scraper', () => {
    const sampleHTML = `
        <div class="article">
        <h1 class="title">Article 1</h1>
        <a class="link" href="http://example.com/article1"></a>
        <p class="summary">Summary 1</p>
        </div>
        <div class="article">
        <h1 class="title">Article 2</h1>
        <a class="link" href="http://example.com/article2"></a>
        <p class="summary">Summary 2</p>
        </div>
        <div class="article">
        <h1 class="title">Article 3</h1>
        <a class="link" href="http://example.com/article3"></a>
        <p class="summary">Summary 3</p>
        </div>
    `;

    const config = {
        url: 'http://example.com',
        articleSelector: '.article',
        titleSelector: '.title',
        linkSelector: '.link',
        summarySelector: '.summary',
        sliceCount: 2,
        sourceName: 'Example Source',
    };

    let scraper: AbstractScraper;

    beforeEach(() => {
        (axios.get as jest.Mock).mockResolvedValue({ data: sampleHTML });
        scraper = new AbstractScraper(config);
    });

    it('should use empty string if href is missing', async () => {
        const sampleHTMLWithMissingHref = `
          <div class="article">
            <h1 class="title">Article without href</h1>
            <a class="link"></a> <!-- href intencionalmente ausente -->
            <p class="summary">Summary without href</p>
          </div>
        `;
        (axios.get as jest.Mock).mockResolvedValue({ data: sampleHTMLWithMissingHref });

        const headlines = await scraper.scrapeData();
        expect(headlines[0].url).toBe('');
    });

    it('should return the correct number of headlines according to sliceCount', async () => {
        const headlines = await scraper.scrapeData();
        expect(headlines).toHaveLength(config.sliceCount);
    });

    it('should correctly extract data from items', async () => {
        const headlines = await scraper.scrapeData();

        expect(headlines[0].title).toBe('Article 1');
        expect(headlines[0].url).toBe('http://example.com/article1');
        expect(headlines[0].summary).toBe('Summary 1');
        expect(headlines[0].source).toBe('Example Source');
        expect(typeof headlines[0].publishedAt).toBe('number');

        expect(headlines[1].title).toBe('Article 2');
        expect(headlines[1].url).toBe('http://example.com/article2');
        expect(headlines[1].summary).toBe('Summary 2');
        expect(headlines[1].source).toBe('Example Source');
        expect(typeof headlines[1].publishedAt).toBe('number');
    });

    it('should call axios.get with the correct URL', async () => {
        await scraper.scrapeData();
        expect(axios.get).toHaveBeenCalledWith(config.url);
    });

    it('should throw an error when axios.get fails', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));
        await expect(scraper.scrapeData()).rejects.toThrow('Network Error');
    });

    it('should handle missing summarySelector gracefully', async () => {
        const configWithoutSummary = { ...config, summarySelector: undefined };
        const scraperWithoutSummary = new AbstractScraper(configWithoutSummary);
        const headlines = await scraperWithoutSummary.scrapeData();

        expect(headlines[0].summary).toBe("");
    });

    it('should default to 5 headlines if sliceCount is not provided', async () => {
        const extendedHTML = `
          <div class="article">
            <h1 class="title">Article 1</h1>
            <a class="link" href="http://example.com/article1"></a>
            <p class="summary">Summary 1</p>
          </div>
          <div class="article">
            <h1 class="title">Article 2</h1>
            <a class="link" href="http://example.com/article2"></a>
            <p class="summary">Summary 2</p>
          </div>
          <div class="article">
            <h1 class="title">Article 3</h1>
            <a class="link" href="http://example.com/article3"></a>
            <p class="summary">Summary 3</p>
          </div>
          <div class="article">
            <h1 class="title">Article 4</h1>
            <a class="link" href="http://example.com/article4"></a>
            <p class="summary">Summary 4</p>
          </div>
          <div class="article">
            <h1 class="title">Article 5</h1>
            <a class="link" href="http://example.com/article5"></a>
            <p class="summary">Summary 5</p>
          </div>
          <div class="article">
            <h1 class="title">Article 6</h1>
            <a class="link" href="http://example.com/article6"></a>
            <p class="summary">Summary 6</p>
          </div>
        `;
        (axios.get as jest.Mock).mockResolvedValue({ data: extendedHTML });

        const configWithoutSliceCount = { ...config };
        delete configWithoutSliceCount.sliceCount;
        const scraperWithoutSliceCount = new AbstractScraper(configWithoutSliceCount);

        const headlines = await scraperWithoutSliceCount.scrapeData();
        expect(headlines).toHaveLength(5);
    });
});