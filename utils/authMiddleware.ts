import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../utils/auth';

export function authMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = verifyToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.body.userId = userId;
    return handler(req, res);
  };
}
