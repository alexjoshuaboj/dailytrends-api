import { FeedService } from '@services/feed/feed.service';
import { IFeedRepository } from '@interfaces/feed/IFeedRepository';
import { IFeed } from '@interfaces/feed/IFeed';

describe('FeedService', () => {
  let feedRepository: IFeedRepository;
  let feedService: FeedService;
  const mockFeed: IFeed = { 
    _id: '1', 
    title: 'Test Feed', 
    url: 'http://example.com/',
    publishedAt: 123456,
    summary: 'Summary Test',
    source: 'Source Test'
  };

  beforeEach(() => {
    feedRepository = {
      find: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAndSaveTodayFeeds: jest.fn(),
      createMany: jest.fn(),
    } as unknown as IFeedRepository;

    feedService = new FeedService(feedRepository);
  });

  it('getFeeds should return the list of feeds', async () => {
    (feedRepository.find as jest.Mock).mockResolvedValue([mockFeed]);

    const feeds = await feedService.getFeeds();

    expect(feedRepository.find).toHaveBeenCalled();
    expect(feeds).toEqual([mockFeed]);
  });

  it('createFeed should create a feed and return it', async () => {
    (feedRepository.create as jest.Mock).mockResolvedValue(mockFeed);

    const feed = await feedService.createFeed(mockFeed);

    expect(feedRepository.create).toHaveBeenCalledWith(mockFeed);
    expect(feed).toEqual(mockFeed);
  });

  it('deleteFeed should call the repositories delete method', async () => {
    (feedRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await feedService.deleteFeed('1');

    expect(feedRepository.delete).toHaveBeenCalledWith('1');
  });

  it('updateFeed should update the feed and return it', async () => {
    (feedRepository.update as jest.Mock).mockResolvedValue(mockFeed);

    const updatedFeed = await feedService.updateFeed('1', mockFeed);

    expect(feedRepository.update).toHaveBeenCalledWith('1', mockFeed);
    expect(updatedFeed).toEqual(mockFeed);
  });

  it('findFeedById should return the searched feed', async () => {
    (feedRepository.findById as jest.Mock).mockResolvedValue(mockFeed);

    const feed = await feedService.findFeedById('1');

    expect(feedRepository.findById).toHaveBeenCalledWith('1');
    expect(feed).toEqual(mockFeed);
  });

  it('findAndSaveTodayFeeds should return the days feeds', async () => {
    (feedRepository.findAndSaveTodayFeeds as jest.Mock).mockResolvedValue([mockFeed]);

    const feeds = await feedService.findAndSaveTodayFeeds();

    expect(feedRepository.findAndSaveTodayFeeds).toHaveBeenCalled();
    expect(feeds).toEqual([mockFeed]);
  });

  it('createManyFeeds should create multiple feeds and return them', async () => {
    const feedsToCreate: IFeed[] = [mockFeed];
    (feedRepository.createMany as jest.Mock).mockResolvedValue(feedsToCreate);

    const feeds = await feedService.createManyFeeds(feedsToCreate);

    expect(feedRepository.createMany).toHaveBeenCalledWith(feedsToCreate);
    expect(feeds).toEqual(feedsToCreate);
  });
});
