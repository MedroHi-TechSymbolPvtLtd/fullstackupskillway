import axios from 'axios';
import prisma from '../config/database';
import { BadRequestError } from '../utils/errors';

const fetchImageHead = async (url: string) => {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return response.headers['content-type'] as string | undefined;
  } catch (error) {
    throw new BadRequestError('Unable to reach the provided image URL');
  }
};

export const loadImageFromUrl = async (url: string, actorId: string) => {
  const mimeType = await fetchImageHead(url);

  if (!mimeType || !mimeType.startsWith('image/')) {
    throw new BadRequestError('URL must point to a valid image resource');
  }

  const userExists = await prisma.user.findUnique({ where: { id: actorId } });
  if (!userExists) {
    throw new BadRequestError('Invalid user context');
  }

  const asset = await prisma.imageAsset.create({
    data: {
      url,
      sourceUrl: url,
      mimeType,
      createdBy: actorId,
    },
    select: {
      id: true,
      url: true,
      mimeType: true,
      createdAt: true,
    },
  });

  return asset;
};

