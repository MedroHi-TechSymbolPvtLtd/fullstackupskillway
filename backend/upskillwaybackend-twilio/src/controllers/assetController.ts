import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';
import { sendSuccess } from '../utils/response';
import { loadImageFromUrl } from '../services/assetService';

export const loadImageFromUrlController = asyncHandler(async (req: Request, res: Response) => {
  const createdBy = req.user!.id;
  const asset = await loadImageFromUrl(req.body.url, createdBy);

  sendSuccess(
    res,
    {
      imageId: asset.id,
      url: asset.url,
      mimeType: asset.mimeType,
      createdAt: asset.createdAt,
    },
    'Image asset created successfully',
    201
  );
});

