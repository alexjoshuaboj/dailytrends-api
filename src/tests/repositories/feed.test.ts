import { FeedRepository } from '@repositories/feed.repository';
import FeedModel from '@models/feed';
import { ScraperService } from '@adapters/scraper/scraper';
import {IFeed} from '@interfaces/feed/IFeed';
import dayjs from 'dayjs';

jest.mock('@models/feed');
jest.mock('@adapters/scraper/scraper');

describe('FeedRepository', () => {
  let feedRepository: FeedRepository;

  beforeEach(() => {
    feedRepository = new FeedRepository();
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('you must call FeedModel.findById with the correct ID and return the result', async () => {
      const mockFeed = { _id: '123', title: 'Test feed' };
      (FeedModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFeed),
      });

      const result = await feedRepository.findById('123');

      expect(FeedModel.findById).toHaveBeenCalledWith('123', {"_id": 1, "publishedAt": 1, "source": 1, "summary": 1, "title": 1, "url": 1}, {"lean": true});
      expect(result).toEqual(mockFeed);
    });
  });

  describe('create', () => {
    it('you must call FeedModel.create with the feed and return the result', async () => {
      const mockFeed = { title: 'Test feed' } as IFeed;
      (FeedModel.create as jest.Mock).mockResolvedValue(mockFeed);

      const result = await feedRepository.create(mockFeed);

      expect(FeedModel.create).toHaveBeenCalledWith(mockFeed);
      expect(result).toEqual(mockFeed);
    });
  });

  describe('find', () => {
    it('you must call FeedModel.find and return the results', async () => {
      const mockFeeds = [{ title: 'Feed 1' }, { title: 'Feed 2' }] as IFeed[];
      (FeedModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFeeds),
      });

      const result = await feedRepository.find();

      expect(FeedModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockFeeds);
    });
  });

  describe('delete', () => {
    it('should call FeedModel.deleteOne with the correct ID and return the result', async () => {
      const mockFeed = { _id: '123', title: 'Feed to delete' };
      (FeedModel.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFeed),
      });
  
      const result = await feedRepository.delete('123');
  
      expect(FeedModel.deleteOne).toHaveBeenCalledWith({ _id: '123' });
      expect(result).toEqual(mockFeed);
    });
  });

  describe('updateOne', () => {
    it('you should call FeedModel.findByIdAndUpdate with the correct ID, feed, and options, returning the updated feed', async () => {
      const mockFeed = { _id: '123', title: 'Updated feed' };
      (FeedModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFeed),
      });

      const feedData = { title: 'New title' } as IFeed;
      const result = await feedRepository.update('123', feedData);

      expect(FeedModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        feedData,
        { new: true, lean: true }
      );
      expect(result).toEqual(mockFeed);
    });
  });

  describe('findAndSaveToday', () => {
    it('should return existing feeds if it finds feeds today', async () => {
      const mockFeeds = [{ _id: '1', title: 'Today feed' }] as IFeed[];
      (FeedModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockFeeds),
      });

      const result = await feedRepository.findAndSaveTodayFeeds();

      expect(FeedModel.find).toHaveBeenCalledWith({
        publishedAt: {
          $gte: dayjs().startOf('day').unix(),
          $lt: dayjs().endOf('day').unix(),
        },
      },
      {"_id": 1, "publishedAt": 1, "source": 1, "summary": 1, "title": 1, "url": 1}, 
      {"lean": true});
      expect(result).toEqual(mockFeeds);
    });

    it('you should scrape, create and return feeds if you dont find feeds today', async () => {
      const mockFeeds = [
        { title: 'Scraped feed 1' },
        { title: 'Scraped feed 2' },
      ] as IFeed[];

      (FeedModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      (ScraperService.scrapeAll as jest.Mock).mockResolvedValue(mockFeeds);

      (FeedModel.insertMany as jest.Mock).mockResolvedValue(mockFeeds);

      const result = await feedRepository.findAndSaveTodayFeeds();

      expect(ScraperService.scrapeAll).toHaveBeenCalled();
      expect(FeedModel.insertMany).toHaveBeenCalledWith(mockFeeds);
      expect(result).toEqual(mockFeeds);
    });
  });

  describe('createMany', () => {
    it('you should call FeedModel.insertMany with the feeds and return the result', async () => {
      const mockFeeds = [
        { title: 'Feed 1' },
        { title: 'Feed 2' },
      ] as IFeed[];

      (FeedModel.insertMany as jest.Mock).mockResolvedValue(mockFeeds);

      const result = await feedRepository.createMany(mockFeeds);

      expect(FeedModel.insertMany).toHaveBeenCalledWith(mockFeeds);
      expect(result).toEqual(mockFeeds);
    });
  });
});
