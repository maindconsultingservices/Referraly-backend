import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../utils/db';
import { authMiddleware } from '../../../middleware/authMiddleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.body.userId;
  const { languagePreference } = req.body;

  await prisma.user.update({
    where: { id: userId },
    data: { languagePreference },
  });

  res.status(200).json({ message: 'Language preference updated' });
}

export default authMiddleware(handler);
