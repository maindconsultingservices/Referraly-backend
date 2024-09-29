import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { generateExternalAffiliateId } from '../../../utils/affiliate';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const { programId } = req.body;

  const secretKey = process.env.SECRET_KEY!;

  const externalId = generateExternalAffiliateId(userId, programId, secretKey);

  await prisma.externalAffiliateId.create({
    data: { userId, programId, externalId },
  });

  res.status(201).json({ externalId });
}

export default authMiddleware(handler);
