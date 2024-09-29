import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';
import crypto from 'crypto';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const { programId } = req.body;

  const secretKey = process.env.SECRET_KEY!;

  const data = `${userId}-${programId}`;
  const hash = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
  const externalId = hash.substring(0, 12);

  await prisma.externalAffiliateId.create({
    data: { userId, programId, externalId },
  });

  res.status(201).json({ externalId });
}

export default authMiddleware(handler);
