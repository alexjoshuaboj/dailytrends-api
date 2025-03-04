// tests/controllers/FeedController.test.ts

import { Request, Response } from 'express';
import { FeedController } from '@controllers/feed.controller';
import { IFeed } from '@interfaces/feed/IFeed';

describe('FeedController', () => {
  let feedController: FeedController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    feedController = new FeedController();

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getFeed', () => {
    it('You must respond with the feed obtained and status 200', async () => {
      const mockFeed: Partial<IFeed> = { _id: '1', title: 'Feed de prueba', publishedAt: 123456 };
      req = {
        params: { feedId: '1' },
      };

      feedController['feedService'].findFeedById = jest.fn().mockResolvedValue(mockFeed);

      await feedController.getFeed(req as Request, res as Response);

      expect(feedController['feedService'].findFeedById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFeed);
    });

    it('should respond with error and status 500 if an exception occurs', async () => {
      const errorMessage = 'Error inesperado';
      req = {
        params: { feedId: '1' },
      };

      feedController['feedService'].findFeedById = jest.fn().mockRejectedValue(new Error(errorMessage));

      await feedController.getFeed(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('getFeeds', () => {
    it('should respond with the list of feeds and status 200', async () => {
      const mockFeeds: Partial<IFeed>[] = [
        { _id: '1', title: 'Feed 1', publishedAt: 123456 },
        { _id: '2', title: 'Feed 2', publishedAt: 123457 },
      ];

      feedController['feedService'].findAndSaveTodayFeeds = jest.fn().mockResolvedValue(mockFeeds);

      await feedController.getFeeds({} as Request, res as Response);

      expect(feedController['feedService'].findAndSaveTodayFeeds).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFeeds);
    });

    it('should respond with error and status 500 if an exception occurs', async () => {
      const errorMessage = 'Error al obtener feeds';
      feedController['feedService'].findAndSaveTodayFeeds = jest.fn().mockRejectedValue(new Error(errorMessage));

      await feedController.getFeeds({} as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('createFeed', () => {
    it('you should create a feed, assign publishedAt and respond with status 201', async () => {
      const newFeed: Partial<IFeed> = { _id: '1', title: 'Nuevo Feed', publishedAt: 0 };
      req = { body: { title: newFeed.title } };

      feedController['feedRepository'].create = jest.fn().mockImplementation(async (feed: IFeed) => {
        return { ...feed, _id: '1' };
      });

      await feedController.createFeed(req as Request, res as Response);

      expect(feedController['feedRepository'].create).toHaveBeenCalled();
      const feedArg = (feedController['feedRepository'].create as jest.Mock).mock.calls[0][0];
      expect(feedArg.title).toBe(newFeed.title);
      expect(typeof feedArg.publishedAt).toBe('number');

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ...feedArg, _id: '1' });
    });

    it('should respond with error and status 500 if an exception occurs while creating', async () => {
      const errorMessage = 'Error al crear feed';
      req = { body: { title: 'Feed de error' } };

      feedController['feedRepository'].create = jest.fn().mockRejectedValue(new Error(errorMessage));

      await feedController.createFeed(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('deleteFeed', () => {
    it('you should delete the feed and reply with success message', async () => {
      req = { params: { feedId: '1' } };

      feedController['feedRepository'].findById = jest.fn().mockResolvedValue({ id: '1' });
      feedController['feedRepository'].delete = jest.fn().mockResolvedValue(undefined);

      await feedController.deleteFeed(req as Request, res as Response);

      expect(feedController['feedRepository'].findById).toHaveBeenCalledWith('1');
      expect(feedController['feedRepository'].delete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Feed deleted successfully' });
    });

    it('should respond with no content if feed not found', async () => {
      req = { params: { feedId: '1' } };
  
      feedController['feedRepository'].findById = jest.fn().mockResolvedValue(undefined);
  
      await feedController.deleteFeed(req as Request, res as Response);
  
      expect(feedController['feedRepository'].findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ error: 'Feed not found' });
    });

    it('should respond with error and status 500 if an exception occurs while deleting', async () => {
      const errorMessage = 'Error al eliminar feed';
      req = { params: { feedId: '1' } };

      feedController['feedRepository'].findById = jest.fn().mockResolvedValue({ id: '1' });
      feedController['feedRepository'].delete = jest.fn().mockRejectedValue(new Error(errorMessage));

      await feedController.deleteFeed(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('updateFeed', () => {
    it('you should refresh the feed and reply with the updated feed', async () => {
      const updatedFeed: Partial<IFeed> = { _id: '1', title: 'Feed Actualizado', publishedAt: 123456 };
      req = { params: { feedId: '1' }, body: { title: updatedFeed.title } };

      feedController['feedRepository'].findById = jest.fn().mockResolvedValue({ id: '1' });
      feedController['feedRepository'].update = jest.fn().mockResolvedValue(updatedFeed);

      await feedController.updateFeed(req as Request, res as Response);

      expect(feedController['feedRepository'].findById).toHaveBeenCalledWith('1');
      expect(feedController['feedRepository'].update).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedFeed);
    });

    it('should respond with no content if feed not found', async () => {
      req = { params: { feedId: '1' } };
  
      feedController['feedRepository'].findById = jest.fn().mockResolvedValue(undefined);
  
      await feedController.deleteFeed(req as Request, res as Response);
  
      expect(feedController['feedRepository'].findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ error: 'Feed not found' });
    });

    it('should respond with error and status 500 if an exception occurs while updating', async () => {
      const errorMessage = 'Error al actualizar feed';
      req = { params: { feedId: '1' }, body: { title: 'Feed Error' } };

      feedController['feedRepository'].findById = jest.fn().mockResolvedValue({ id: '1' });
      feedController['feedRepository'].update = jest.fn().mockRejectedValue(new Error(errorMessage));

      await feedController.updateFeed(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
