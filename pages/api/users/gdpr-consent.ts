import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;

  await prisma.user.update({
    where: { id: userId },
    data: {
      gdprConsent: true,
      gdprConsentDate: new Date(),
    },
  });

  res.status(200).json({ message: 'GDPR consent recorded' });
}

export default authMiddleware(handler);
