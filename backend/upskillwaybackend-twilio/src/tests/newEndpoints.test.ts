import request from 'supertest';
import app from '../app';
import { getStudyAbroadDestinations } from '../services/studyAbroadService';
import { loadImageFromUrl } from '../services/assetService';
import { getCourseCurriculum } from '../services/cmsService';

jest.mock('../services/studyAbroadService', () => {
  const actual = jest.requireActual('../services/studyAbroadService');
  return {
    ...actual,
    getStudyAbroadDestinations: jest.fn(),
  };
});

jest.mock('../services/assetService', () => {
  const actual = jest.requireActual('../services/assetService');
  return {
    ...actual,
    loadImageFromUrl: jest.fn(),
  };
});

jest.mock('../services/cmsService', () => {
  const actual = jest.requireActual('../services/cmsService');
  return {
    ...actual,
    getCourseCurriculum: jest.fn(),
  };
});

jest.mock('../middlewares/auth', () => {
  const passthrough = (_req: any, _res: any, next: any) => next();
  return {
    authenticate: (req: any, _res: any, next: any) => {
      req.user = { id: 'test-user', role: 'admin' };
      next();
    },
    requireAdmin: passthrough,
    requireAuth: passthrough,
    requireRole: () => passthrough,
    requireSales: passthrough,
    requireWhatsAppPermission: passthrough,
  };
});

const mockedGetStudyAbroadDestinations = getStudyAbroadDestinations as jest.MockedFunction<
  typeof getStudyAbroadDestinations
>;

const mockedLoadImageFromUrl = loadImageFromUrl as jest.MockedFunction<typeof loadImageFromUrl>;

const mockedGetCourseCurriculum = getCourseCurriculum as jest.MockedFunction<typeof getCourseCurriculum>;

describe('New Endpoint Coverage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/study-abroad/destinations', () => {
    it('returns filtered destinations', async () => {
      const apiResponse = {
        destinations: [
          {
            id: 'destination-1',
            city: 'Toronto',
            universities: ['UofT'],
            pricePerYear: 25000,
          },
        ],
        pagination: {
          limit: 10,
          offset: 0,
          total: 1,
        },
      };

      mockedGetStudyAbroadDestinations.mockResolvedValue(apiResponse);

      const response = await request(app)
        .get('/api/v1/study-abroad/destinations')
        .query({
          city: 'Toronto',
          minTuition: 20000,
          maxTuition: 30000,
          keyword: 'innovation',
        })
        .expect(200);

      expect(mockedGetStudyAbroadDestinations).toHaveBeenCalledWith(
        expect.objectContaining({
          city: 'Toronto',
          minTuition: 20000,
          maxTuition: 30000,
          keyword: 'innovation',
        })
      );

      expect(response.body).toMatchObject({
        success: true,
        data: apiResponse.destinations,
      });
    });
  });

  describe('POST /api/v1/assets/load-image-from-url', () => {
    it('stores an image asset and returns identifiers', async () => {
      mockedLoadImageFromUrl.mockResolvedValue({
        id: 'image-id',
        url: 'https://cdn.example.com/image.png',
        mimeType: 'image/png',
        createdAt: new Date().toISOString(),
      } as any);

      const response = await request(app)
        .post('/api/v1/assets/load-image-from-url')
        .send({ url: 'https://example.com/source.png' })
        .expect(201);

      expect(mockedLoadImageFromUrl).toHaveBeenCalledWith('https://example.com/source.png', 'test-user');
      expect(response.body).toMatchObject({
        success: true,
        data: {
          imageId: 'image-id',
          url: 'https://cdn.example.com/image.png',
        },
      });
    });
  });

  describe('GET /api/v1/cms/courses/:id/curriculum', () => {
    it('returns the stored curriculum for a course', async () => {
      mockedGetCourseCurriculum.mockResolvedValue({
        id: 'course-123',
        title: 'Data Science',
        curriculum: [
          { moduleTitle: 'Module 1', topics: ['Intro'] },
          { moduleTitle: 'Module 2', topics: ['Advanced'] },
        ],
      });

      const response = await request(app)
        .get('/api/v1/cms/courses/course-123/curriculum')
        .expect(200);

      expect(mockedGetCourseCurriculum).toHaveBeenCalledWith('course-123');
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: 'course-123',
          curriculum: expect.arrayContaining([
            expect.objectContaining({ moduleTitle: 'Module 1' }),
          ]),
        },
      });
    });
  });
});

