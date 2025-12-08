import { Request, Response, NextFunction } from 'express';
import { normalizeTrainingPayload } from '../utils/trainingNormalizer';

export const trainingPayloadNormalizer = (req: Request, _res: Response, next: NextFunction) => {
  req.body = normalizeTrainingPayload(req.body);
  next();
};


